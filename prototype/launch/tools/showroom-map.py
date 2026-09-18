"""Build the showroom map SVG (index.html, chapter 5) from OpenStreetMap data.

1. Download roads + coastline around the showroom (Overpass, © OpenStreetMap contributors, ODbL):
   curl -s --data-urlencode 'data=[out:json][timeout:50];(way["highway"~"^(motorway|trunk|primary|secondary|tertiary|residential|unclassified|trunk_link|primary_link)$"](14.726,-17.522,14.746,-17.495);way["natural"="coastline"](14.715,-17.535,14.757,-17.48););out geom;' https://overpass.kumi.systems/api/interpreter -o osm.json
2. Run: python3 showroom-map.py (writes map.svg)
3. Paste map.svg into the .map-stage block of index.html.
The pin is the Google Maps place "Mansour Motors" (14.7347277, -17.5085261), Route de la Corniche Ouest,
Almadies. Not the nearby Plus Code PFPR+9J7, which sits about 130 m north.
"""
import json, math
d = json.load(open('osm.json'))

def stitch(ways):
    segs = [[(p['lon'], p['lat']) for p in w['geometry']] for w in ways]
    chains = []
    while segs:
        c = segs.pop(0)
        grown = True
        while grown:
            grown = False
            for s in segs:
                if s[0] == c[-1]: c = c + s[1:]; segs.remove(s); grown = True; break
                if s[-1] == c[0]: c = s[:-1] + c; segs.remove(s); grown = True; break
        chains.append(c)
    return chains

chains = stitch([e for e in d['elements'] if e['tags'].get('natural') == 'coastline'])
LON0, LON1, LAT0, LAT1 = -17.529, -17.491, 14.721, 14.750
W = 800
KX = W / (LON1 - LON0)
KY = KX / math.cos(math.radians((LAT0 + LAT1) / 2))
H = round((LAT1 - LAT0) * KY)
P = lambda lon, lat: ((lon - LON0) * KX, (LAT1 - lat) * KY)
PIN = P(-17.5085261, 14.7347277)

def simplify(pts, eps=0.7):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1e-9
    i, dm = 0, 0
    for k in range(1, len(pts) - 1):
        x, y = pts[k]
        dd = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / L
        if dd > dm: i, dm = k, dd
    if dm > eps: return simplify(pts[:i + 1], eps)[:-1] + simplify(pts[i:], eps)
    return [pts[0], pts[-1]]

def path(pts, close=False):
    s = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    return s + ('Z' if close else '')

def inside(pts, m=60):
    return any(-m < x < W + m and -m < y < H + m for x, y in pts)

# land: mainland closed through a far inland point to the east, plus islands
land = []
for c in chains:
    pts = [P(*p) for p in c]
    if c[0] != c[-1]:
        pts += [P(-17.40, 14.69), P(-17.40, 14.78)]  # land is left of the coastline: close it inland
    if not inside(pts): continue
    n = len(pts) // 2  # a closed ring collapses under one pass; simplify each half
    land.append(path(simplify(pts[:n + 1], 0.5) + simplify(pts[n:], 0.5)[1:], True))

cls = {'trunk': 'r-main', 'trunk_link': 'r-main', 'primary': 'r-main', 'primary_link': 'r-main',
       'secondary': 'r-mid', 'tertiary': 'r-mid', 'unclassified': 'r-small', 'residential': 'r-small'}
groups = {'r-small': [], 'r-mid': [], 'r-main': []}
for e in d['elements']:
    h = e['tags'].get('highway')
    if not h: continue
    pts = [P(g['lon'], g['lat']) for g in e['geometry']]
    if not inside(pts): continue
    groups[cls[h]].append(path(simplify(pts)))

# the drive: northbound Corniche, cut where it passes the showroom
ids = [335599281, 8115724, 466633109, 643257852, 361852073]
byid = {e['id']: e for e in d['elements']}
route = []
for i in ids:
    g = [P(p['lon'], p['lat']) for p in byid[i]['geometry']]
    route += g if not route else g[1:]
def foot(a, b, p):
    # nearest point to p on segment ab
    dx, dy = b[0] - a[0], b[1] - a[1]
    t = max(0, min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy or 1)))
    return (a[0] + t * dx, a[1] + t * dy)
k = min(range(len(route) - 1), key=lambda j: math.dist(foot(route[j], route[j + 1], PIN), PIN))
drive = simplify(route[:k + 1] + [foot(route[k], route[k + 1], PIN)], 0.3)

out = [f'<svg class="map" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="map-title">',
       '<title id="map-title">Plan d\'accès : Mansour Motors, route de la Corniche Ouest, Almadies, Dakar</title>',
       '<g class="land">' + ''.join(f'<path d="{p}"/>' for p in land) + '</g>']
for c in ('r-small', 'r-mid', 'r-main'):
    out.append(f'<path class="{c}" d="{" ".join(groups[c])}"/>')
out.append(f'<path class="drive" id="drive" d="{path(drive)}"/>')
out.append(f'<g class="pin" transform="translate({PIN[0]:.1f} {PIN[1]:.1f})"><circle r="24"/></g>')
out.append(f'<g class="map-car" data-car transform="translate({PIN[0]:.1f} {PIN[1]:.1f})"><use href="#car-top" x="-7" y="-14.7" width="14" height="29.4"/></g>')
A = P(-17.5215, 14.7455)  # Almadies point
out.append(f'<text class="map-label map-sea" x="150" y="{H - 90}">Océan Atlantique</text>')
out.append(f'<text class="map-label" x="{A[0]:.0f}" y="{A[1]:.0f}">Almadies</text>')
out.append(f'<text class="map-label map-here" x="{PIN[0] + 20:.0f}" y="{PIN[1] + 5:.0f}">Mansour Motors</text>')
out.append('</svg>')
svg = '\n'.join(out)
open('map.svg', 'w').write(svg)
print(W, H, PIN, len(svg), len(drive))
