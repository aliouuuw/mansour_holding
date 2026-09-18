# Mansour Motors — prototypes

Two directions for the public redesign, sharing one data source (`data.js`) so both
show the same eight real machines.

| | Direction | URL |
|---|---|---|
| **A** | Le Carnet de Route — the rally navigator's road-book | `/` |
| **B** | La Piste — drive the parc through the Dakar heat (WebGL) | `/piste/` |
| **E** | L'Accrochage — the stock hung as an exhibition, one spotlight | `/accrochage/` |
| **F** | Showroom — a usable dealership, Avantgarde IA, light Polestar finish | `/showroom/` |
| **G** | Showroom de nuit — F in dark, gold LED light system | `/nuit/` |
| **H** | Mono — F's IA in light monochrome, soft-UI, colour on focus | `/mono/` |
| **I** | Launch — F's IA as a car-launch chapter system, black and white | `/launch/` |
| **I+** | Launch turntable — scroll-orbit WebGL photo ring on the same IA | `/launch/` |

Serve `prototype/` and open both:

```bash
bunx serve -p 3008
```

Prototype B has its own verification list in `piste/README.md`.
Two earlier takes on B are kept in `_archive/` and are not served as routes:
`neo-v1` (scroll sequence) and `neo-v2-console` (dock and workspace).

---

# A. Le Carnet de Route

A standalone validation prototype for the Mansour Motors public redesign.
No build step, no framework, no dependencies. Plain HTML, CSS and one ES module.

## Run

```bash
bunx serve -p 3008
```

Then open http://localhost:3008/ (it must be served, not opened as a file — `data.js`
is an ES module).

## What to judge

1. **The first viewport.** A lit window and a paper panel, not a video hero with a
   headline and two buttons. Does the machine read as desirable in the window?
2. **The advance.** Scroll, or use the two knurled knobs, or arrow keys. Each waypoint
   clicks into register, the lamp rakes across the paint once, and the `Parcours`
   figure counts up. One authored motion, not scattered fades.
3. **The column.** `Compteur` is the road-book's distance column and the car's
   odometer at the same time. That match is why this world fits this product.
4. **The tulip.** Drawn from data: ball at the origin, route line, arrow. The branch is
   keyed to fuel — diesel runs straight, essence forks once, hybride forks twice. A
   sold or reserved point gets the laterite halt bar.
5. **State.** Waypoint 08 carries the `VENDU` ink stamp, a dimmed price and a halt bar.
6. **The lamp.** The switch bottom right. Gold is no longer a sprayed accent; it is the
   holder's light, and turning it off takes the light off the paint.
7. **Mobile.** Resize to phone width. The price and the call action stay pinned in view.

## Honest gaps

- **Photography is the ceiling.** These are model-accurate Wikimedia Commons files,
  chosen because the current seed is mismatched stock (its "Land Cruiser 300 GR Sport"
  is a Porsche 911). They are still snapshots, not art direction. Waypoints 01 and 06
  have showroom stand furniture in frame. A real shoot is what lifts this from good to
  the level the direction is aiming at.
- **Waypoint 08 is shown as `sold`** to exercise the stamp. The seed row says
  `reserved`.
- **`color` is set to the colour of the sourced photograph** on several waypoints, so
  the page is internally coherent. The seed values differ.
- **Not built yet:** the catalogue filters, the inquiry form as the crew assistance
  sheet, and the route between landing and vehicle as one continuous roll with no page
  cut. The roll itself is the mechanism that had to be validated first.
- No claim on this page is invented. Every figure comes from the seed rows.

## If this direction is approved

The production work is Next.js, and the roll becomes the shared shell for
`/mansour-motors`, `/mansour-motors/vehicules` and `/mansour-motors/vehicules/[id]`.
Lenis has to be disabled on those three routes: smooth scroll fights the detent.

---

# I+. Launch turntable

Same IA as Launch. First viewport is type on a black rail and a large studio plate
(same crop as the plateau). Search sits in that chapter. Scroll hands the plate to a
front-facing photo fan: 1 → 2 → 3, all eight on screen. Véhicules is an atelier
(featured plate + strip), not the same fan.

Plates in `/media/cars/` are generated restages of Wikimedia photographs onto a black
cyclorama. They are not a Dakar shoot. Model identity is accurate; lighting is not.

```bash
bunx serve -p 3008
```

Open http://localhost:3008/launch/

## What to judge

1. **Hero plate.** One car, not a slideshow. Type sits on a black rail. The plate fills the chapter. The crop matches the plateau.
2. **Search.** « Trouver un véhicule » is in that first chapter. Submit lands on `/launch/vehicules/` with the filters.
3. **Handoff.** Scroll. The plate yields to the plateau. Count goes **01 → 02 → 03**. All eight plates stay in front.
4. **Click.** The plate or « Voir le véhicule » opens that car's detail.
5. **Stock.** `/launch/vehicules/` — Atelier (large plate + strip), Liste, Grille. Not the home fan.
6. **Craft.** Nested-arrow buttons. Drawn underlines. Crop-marked plates. Frosted search dock, HUD, and header. Round green WhatsApp disc. Studio glows on dark chapters.
7. **Phone.** Type, plate, figures, then search, stacked. `prefers-reduced-motion` opens Liste.

