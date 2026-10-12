#!/usr/bin/env python3
"""Rebuild showroom map TSX from OpenStreetMap (Overpass). ODbL — keep attribution."""

from __future__ import annotations

import json
import math
import sys
import urllib.request
from dataclasses import dataclass
from typing import Iterable

OVERPASS = "https://overpass-api.de/api/interpreter"
VIEW_W, VIEW_H = 800, 631
PAD = 48


@dataclass
class Site:
    slug: str
    title: str
    pin_lat: float
    pin_lon: float
    south: float
    west: float
    north: float
    east: float
    sea_label: str
    sea_xy: tuple[float, float]
    area_label: str
    area_xy: tuple[float, float]
    here_xy_offset: tuple[float, float] = (20, 5)


SITES = {
    "dakar": Site(
        slug="dakar",
        title="Plan d'accès : Mansour Motors, route de la Corniche Ouest, Almadies, Dakar",
        pin_lat=14.7347277,
        pin_lon=-17.5085261,
        south=14.728,
        west=-17.518,
        north=14.742,
        east=-17.498,
        sea_label="Océan Atlantique",
        sea_xy=(150, 541),
        area_label="Almadies",
        area_xy=(158, 98),
    ),
    "conakry": Site(
        slug="conakry",
        title="Plan d'accès : Mansour Motors, 3e Avenue, Kaloum, Conakry",
        pin_lat=9.5092,
        pin_lon=-13.7124,
        south=9.502,
        west=-13.722,
        north=9.516,
        east=-13.702,
        sea_label="Océan Atlantique",
        sea_xy=(120, 520),
        area_label="Kaloum",
        area_xy=(140, 120),
    ),
}


def overpass_query(site: Site) -> dict:
    q = f"""
    [out:json][timeout:90];
    (
      way["highway"]({site.south},{site.west},{site.north},{site.east});
      relation["natural"="coastline"]({site.south},{site.west},{site.north},{site.east});
      way["natural"="coastline"]({site.south},{site.west},{site.north},{site.east});
      way["natural"="water"]({site.south},{site.west},{site.north},{site.east});
      relation["natural"="water"]({site.south},{site.west},{site.north},{site.east});
    );
    out body geom;
    >;
    out skel qt;
    """
    req = urllib.request.Request(
        OVERPASS,
        data=f"data={urllib.request.quote(q)}".encode(),
        method="POST",
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "mansour-holding-showroom-map/1.0 (local dev)",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.loads(resp.read())


def project(site: Site, lat: float, lon: float) -> tuple[float, float]:
    x = (lon - site.west) / (site.east - site.west) * (VIEW_W - 2 * PAD) + PAD
    y = (site.north - lat) / (site.north - site.south) * (VIEW_H - 2 * PAD) + PAD
    return x, y


def path_from_nodes(nodes: Iterable[tuple[float, float]]) -> str:
    pts = list(nodes)
    if len(pts) < 2:
        return ""
    parts = [f"M{pts[0][0]:.1f} {pts[0][1]:.1f}"]
    for x, y in pts[1:]:
        parts.append(f"L{x:.1f} {y:.1f}")
    return " ".join(parts)


def road_class(highway: str | None) -> str:
    if highway in ("motorway", "trunk", "primary", "secondary", "corridor"):
        return "r-main"
    if highway in ("tertiary", "unclassified", "residential", "living_street"):
        return "r-mid"
    return "r-small"


def build_land_ring(site: Site) -> str:
    x0, y0 = project(site, site.south, site.west)
    x1, y1 = project(site, site.north, site.east)
    margin = 400
    return (
        f"M{x1 + margin:.1f} {y0 - margin:.1f} "
        f"L{x0 - margin:.1f} {y0 - margin:.1f} "
        f"L{x0 - margin:.1f} {y1 + margin:.1f} "
        f"L{x1 + margin:.1f} {y1 + margin:.1f} Z"
    )


def nearest_main_drive(site: Site, ways: list[dict]) -> tuple[str, tuple[float, float]]:
    px, py = project(site, site.pin_lat, site.pin_lon)
    best: tuple[float, str, tuple[float, float]] | None = None
    for way in ways:
        hw = way.get("tags", {}).get("highway")
        if hw not in ("primary", "secondary", "tertiary", "trunk", "residential", "unclassified"):
            continue
        geom = way.get("geometry") or []
        if len(geom) < 2:
            continue
        pts = [project(site, n["lat"], n["lon"]) for n in geom]
        for i in range(len(pts) - 1):
            ax, ay = pts[i]
            bx, by = pts[i + 1]
            dx, dy = bx - ax, by - ay
            len2 = dx * dx + dy * dy or 1e-9
            t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / len2))
            qx, qy = ax + t * dx, ay + t * dy
            d = math.hypot(px - qx, py - qy)
            if best is None or d < best[0]:
                seg = path_from_nodes(pts[max(0, i - 2) : min(len(pts), i + 4)])
                best = (d, seg, (qx, qy))
    if best is None:
        return f"M{px:.1f} {py:.1f} L{px:.1f} {py - 40:.1f}", (px, py)
    return best[1], (px, py)


def emit(site_key: str) -> str:
    site = SITES[site_key]
    data = overpass_query(site)
    elements = data.get("elements", [])
    ways = [e for e in elements if e.get("type") == "way" and e.get("geometry")]

    by_class: dict[str, list[str]] = {"r-small": [], "r-mid": [], "r-main": []}
    for way in ways:
        tags = way.get("tags") or {}
        if "highway" not in tags and tags.get("natural") not in ("coastline", "water"):
            continue
        if tags.get("natural") in ("coastline", "water"):
            cls = "r-mid"
        else:
            cls = road_class(tags.get("highway"))
        pts = [project(site, n["lat"], n["lon"]) for n in way["geometry"]]
        d = path_from_nodes(pts)
        if d:
            by_class[cls].append(d)

    land = build_land_ring(site)
    drive, pin = nearest_main_drive(site, ways)
    px, py = pin
    hx, hy = px + site.here_xy_offset[0], py + site.here_xy_offset[1]
    comp = "ShowroomMap" if site_key == "dakar" else "ShowroomMapConakry"

    def join_paths(paths: list[str]) -> str:
        return " ".join(paths)

    return f"""'use client'

/* Generated from OpenStreetMap data (© OpenStreetMap contributors, ODbL).
   Do not edit the road paths by hand. Rebuild: python3 tools/showroom-map.py {site_key} */
import {{ useEffect, useRef }} from 'react'

export function {comp}() {{
  const roadRef = useRef<SVGPathElement>(null)
  const carRef = useRef<SVGGElement>(null)
  useEffect(() => {{
    const road = roadRef.current
    const car = carRef.current
    const visit = car?.closest('section')
    if (!road || !car || !visit) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    const len = road.getTotalLength()
    let raf = 0
    const drive = () => {{
      const r = visit.getBoundingClientRect()
      const p = reduce.matches ? 1 : Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.85)))
      const at = p * len
      const a = road.getPointAtLength(Math.max(0, at - 1))
      const b = road.getPointAtLength(Math.min(len, Math.max(1, at)))
      const pos = road.getPointAtLength(at)
      const deg = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90
      car.setAttribute('transform', `translate(${{pos.x.toFixed(1)}} ${{pos.y.toFixed(1)}}) rotate(${{deg.toFixed(1)}})`)
    }}
    const onScroll = () => {{ cancelAnimationFrame(raf); raf = requestAnimationFrame(drive) }}
    addEventListener('scroll', onScroll, {{ passive: true }})
    drive()
    return () => {{ removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }}
  }}, [])

  return (
    <svg className="map" viewBox="0 0 {VIEW_W} {VIEW_H}" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="map-title-{site_key}">
    <title id="map-title-{site_key}">{site.title}</title>
    <g className="land"><path d="{land}"/></g>
    <path className="r-small" d="{join_paths(by_class['r-small'])}"/>
    <path className="r-mid" d="{join_paths(by_class['r-mid'])}"/>
    <path className="r-main" d="{join_paths(by_class['r-main'])}"/>
    <path className="drive" ref={{roadRef}} d="{drive}"/>
    <g className="pin" transform="translate({px:.1f} {py:.1f})"><circle r="24"/></g>
    <g className="map-car" ref={{carRef}} transform="translate({px:.1f} {py:.1f})"><use href="#car-top" x="-7" y="-14.7" width="14" height="29.4"/></g>
    <text className="map-label map-sea" x="{site.sea_xy[0]}" y="{site.sea_xy[1]}">{site.sea_label}</text>
    <text className="map-label" x="{site.area_xy[0]}" y="{site.area_xy[1]}">{site.area_label}</text>
    <text className="map-label map-here" x="{hx:.0f}" y="{hy:.0f}">Mansour Motors</text>
    </svg>
  )
}}
"""


def main() -> None:
    key = sys.argv[1] if len(sys.argv) > 1 else "conakry"
    if key not in SITES:
        print(f"Unknown site {key!r}. Choose: {', '.join(SITES)}", file=sys.stderr)
        sys.exit(1)
    out = (
        "src/app/mansour-motors/_ui/showroom-map.tsx"
        if key == "dakar"
        else "src/app/mansour-motors/_ui/showroom-map-conakry.tsx"
    )
    body = emit(key)
    with open(out, "w", encoding="utf-8") as f:
        f.write(body)
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
