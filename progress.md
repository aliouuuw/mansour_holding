# Project Progress Log

## [Motors] Prix sur demande, and the real catalogue is live

* **Status:** Completed
* **Date:** 2026-09-21

### What was done
* `price` and `color` are nullable. Migrations `0001` and `0002` applied to Neon.
* `fcfa()` and `formatPrice()` render null as **Prix sur demande**. One change each covered the plateau HUD, list rows, cards, detail panel and the live region.
* An unknown price sorts last both ways, survives the budget filter, and is skipped by "nearest in price".
* Back-office form accepts an empty price and colour.
* `src/server/db/catalogue.ts` holds the 19 client vehicles. Seeded to Neon; the 9 demo cars are gone.
* 244 real photos extracted from the PDFs into `public/mansour-motors/vehicles/` (gitignored).
* Hero picks the Rolls-Royce by marque, not by an exact model string.

### Verification
* `bun run type-check` passed. ESLint on Motors: 5 problems, all pre-existing.
* Live render 1440 and 390: hero "Cullinan Black Badge", 19 disponibles sur 19, every price "Prix sur demande", mode copy correct per breakpoint.
* Detail page: 18 photos, "Prix sur demande", Couleur row correctly absent. Zero console errors, zero 4xx.

### Learnings
* `db:push` had been used at some point, so the live schema already had `extras` and the indexes while the migration folder did not. The generated migration failed on ADD COLUMN until made idempotent. Prefer `db:generate` + `db:migrate` over `db:push` on this project.
* Renaming a model broke a hard-coded hero lookup silently: the page fell back to a Lexus rather than erroring. Match on the field least likely to change.

### Open
* **Ferrari Purosangue not seeded.** No sheet states its year and `year` is required. 20th vehicle, pending the client.
* **Mercedes G63: 2 photos, both interior.** No exterior shot exists. **Suzuki Grand Vitara: 1 photo**, and it does not look like a Grand Vitara.
* Images are local and gitignored, so they 404 on Vercel. They must reach R2 before any deploy.
* With every price null, `lineup()`'s "dearest first" no longer orders anything; the plateau is in insertion order.
* Showroom address still unresolved: the PDFs list Almadies, Saly and Conakry; the site shows Corniche Ouest.

---

## [Motors] IA: the showroom closes the page

* **Status:** Completed
* **Date:** 2026-09-20
* **Context:** client catalogue will hold about 25 vehicles.

### What was done
* Deleted the `Seek` component, its markup and all `.seek-*` CSS. The catalogue at `/mansour-motors/vehicules` already ships filters; the landing bar duplicated them and interrupted the hero.
* Reordered: Hero, Lineup, Statement, Alert, Visit. The showroom closes the page.
* A closed today keeps a quiet outline instead of the inverted white plate.
* `Appeler` is the silver plate; `Itineraire` is `tone="soft"`.

### Verification
* `bun run type-check` passed. All remaining imports still used.
* Desk 1440: hero 900, lineup 900, statement 998, alert 692, visit 900. Visit last. Zero console errors.
* Phone 390: same order, visit last at 4068. No overflow at either width.
* Detector: 4 findings, unchanged and pre-existing.

### Learnings
* Removing a section can move a defect into the spotlight. Putting Visit last made the week grid's inverted "Fermé" card the page's final impression, which defeated the reorder. Check what a reorder promotes, not only what it fixes.

### Open
* `Appeler` + `Itineraire` is now a filled-plus-outlined pair, which the house design rules call a preset. Kept because `.btn` / `.soft` is the existing two-tier system across the site. Revisit if the rule should win.
* The pale wedge at the hero-to-plateau seam is drawn by the turntable canvas, not CSS. More visible now that the sections touch. Not diagnosed.
* Empty and small-stock states deferred until the 25-car catalogue lands.
* Blocked on the catalogue: bay names, the hard-coded star, the duplicated hero photo.
* `bun run lint` and `bunx eslint` fail on an eslintrc circular reference. Pre-existing, reproduces on untouched files.

---

## [Motors] The three UI items

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* `.index` used the `padding` shorthand, which overrode the `padding-inline` from `.wrap`. Rows ran to the viewport edge and the status label was shaved. Switched to `padding-block`, which fixes the landing and the catalogue at once.
* Added `wrap` to the landing's `<ol className="index">`; the catalogue already had it.
* `silver-shimmer` no longer runs at rest. It plays on `:hover` and `:focus-visible` only.
* `.fly` keeps its four layout properties. Kept deliberately, reason recorded in `motors.css`.

### Verification
* `bun run type-check` passed.
* Desk 1440, Liste mode: status right edge 1375.2, gutter 64.8px, matching `--pad`. Was 1440 and zero.
* Computed `padding-inline` is 64.8px on both pages; the catalogue keeps its own `padding-block` (19.2 / 80).
* Resting `animation-name` on `.btn::after` is `none`.
* Catalogue at 1440 and 390: zero console errors, no overflow.
* Detector: 4 findings across the directory, all pre-existing.

### Learnings
* A `padding` shorthand on a class that also carries `.wrap` silently kills the gutter. The shared rule was the fix, not the one page that showed the symptom.
* Measure before rewriting for performance. The `.fly` transition ran 48 frames at 16.7ms with none dropped, so the detector warning did not apply: the layer is fixed and holds one child, so the only layout it dirties is its own.

### Open
* IA calls remain: delete the search form, the page's last word, empty and small-stock states.
* Blocked on the catalogue: bay names, the hard-coded star, the duplicated hero photo.

---

## [Motors] The five UX blockers

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Header: opaque `--paper` / `--black` plus a hairline seam. The `backdrop-filter` never landed, so the 58% wash let content print through.
* Tap targets: `.header-end a` and `.sign-links a` are `inline-flex` with `min-height: 44px`.
* `.lineup .lead` follows the mode class (`lead-ring` / `lead-list` / `lead-atelier`), not the breakpoint.
* The Showroom address is an `h2`. Contact is reachable by heading navigation.
* 12.48px type floor across `motors.css` and the hero kicker. `.map-credit` also moved off `--grey-2`, which failed AA on the dark map.

### Verification
* `bun run type-check` passed.
* Real render, 390 and 1440: **zero** strings under 12px (was 47 phone, 36 desk).
* Phone number 44px tall in header and footer. Logo right edge 179px of 390, no overflow.
* Header paints above all content across its whole band at both widths, light and dark tone.
* Mode copy: ring, list and atelier each show exactly one lead. Verified by clicking the real toggle.
* Detector: 3 findings, unchanged and pre-existing.

### Learnings
* `@supports (backdrop-filter: ...)` matches even where the blur renders as a no-op, so it is not a safe gate for legibility. Ship the opaque value outright.

### Open
* The week grid highlights today. On a Sunday the only inverted card reads "Fermé", so the Visit block shouts closed. Part of the peak-end problem, not a bug.
* Still open: the IA calls (delete the search form, the page's last word, empty states), `.fly` at `motors.css:908`, `silver-shimmer`, and everything blocked on the catalogue.

---

## [Motors] Impeccable critique, and the phone fixes

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Dual-agent critique of the landing page. Scored 22/32 (heuristics 7 and 10 n/a, Persuade surface).
* Fixed the P0: `motors.css` hid price, specs, status and CTA on `.lineup .atelier-meta` below 860px. The panel now sits under the photo.
* Fixed `.ink span` resting colour (`#c9c4bb`, 1.55:1) to `--grey-2` (3.9:1). `.on` is emphasis now, not existence.
* Dropped `whitespace-nowrap` on the hero title. A real model name measured 730px in a 390px viewport.
* `prestige()` skips sold cars.

### Verification
* `bun run type-check` passed.
* Real 390px render: price 185 000 000 FCFA at 21.6px, status `Disponible`, CTA 354x48. No horizontal overflow.
* Three long model names all wrap inside 390px (right edge 372) and inside 1440px (right edge 1375).
* Detector: no new findings. Three pre-existing remain.

### Learnings
* A clean detector run is not a clean page. The detector passed the landing page while its phone build hid the price.
* Measure the resting state, not the settled one. The evidence pass scored `.ink` at 16.85:1 because it measured after the scroll handler ran.

### Open
* Not done, out of agreed scope: hero price (deliberately pure), header opacity (P2), `.fly` layout transition at `motors.css:908`, Showroom heading, stale Liste copy, bay-name truncation.
* Catalogue is being replaced with client data soon, so hard-coded models were left alone.
* Critique snapshot in `.impeccable/critique/` is untracked. Commit or gitignore it.

---

## [Motors] Reusable UI kit, silver Button

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* `_ui` kit: `Button` (default = hero nickel), `tone="soft"` for tertiary, `Plate` for overlay CTAs, `Field` / `Fieldset`, `Chapter`.
* Landing, catalog, detail, not-found use the kit. Seek plate stays custom CSS.
* `BUDGETS` and `YEARS` live in `_ui/shared`.

### Verification
* `bun run type-check` passed.
* Landing: 8 silver plates share `linear-gradient(168deg, rgb(74, 73…)`.
* Detail: `Envoyer` / `Réserver` are silver. `Tout le stock` / WhatsApp / Appeler stay `.soft`.
* `#visite` CTA scrolls to the form.

### Learnings
* Do not put Seek labels on `Field`. The register plate uses `.seek-form label`, not `.field`.

---

## [Motors] Hero and Seek start on Tailwind

* **Status:** In progress
* **Date:** 2026-09-20

### What was done
* Hygiene commit `d8ec9de` is on `main`.
* Added `mm` colors, `font-mm`, `mm` and `desk` breakpoints to `@theme`.
* Hero layout uses Tailwind utilities. Seek grid stays in `motors.css` (arbitrary `grid-cols` did not compile).

### Verification
* 1440: Seek columns `193 278 278 278 161`, height 94px. Hero still reads as ink on the floor.

---

## [Hygiene] Dropped Lenis

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Removed `lenis` and `SmoothScroll`. Root layout uses native scroll.
* Other packages stay: each still has an importer (dashboard, auth, holding home).

### Verification
* `bun run type-check` passed.
* `package.json` has no `lenis`.

---

## [Motors] Unused mark assets removed

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Deleted unused `mark.tsx`, `hero-car.png`, `mark.jpg`, `mark-m.jpg`, `mark.svg`.
* Kept `hero-still.jpg`, `hero-still-m.jpg`, `hero-still-a.jpg` (landing + seed).

### Verification
* Grep: no remaining imports of `HouseMark` or those paths.

---

## Next: finish the Tailwind pass on Motors

* **Status:** Planned
* **Date:** 2026-09-20

### State today
* All 25 `prd.json` tasks pass. Remaining work is design polish, not backlog.
* `_ui` kit exists: `Button`, `Field`, `Fieldset`, `Chapter`, `Plate`, `Card`, `Shell`.
* `motors.css` is 971 lines. Hero uses Tailwind utilities. Seek grid, plates, and chapters stay in CSS.
* Dependency hygiene is done. Lenis and the unused mark assets are deleted.

### Scope
1. Move catalog and detail layout to Tailwind utilities.
2. Keep bespoke surfaces (nickel plate, seek grid, floor veil) in `motors.css`.
3. Target: `motors.css` under 600 lines with no visual change.

### Blocked / open
* `main` is 4 commits ahead of `origin/main`. Push before the next pass.

---

## [Motors] Hero title contrast is a floor veil

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Removed title stroke and bloom. No glyph halo.
* Contrast is a stronger paper gradient on `.hero-copy` (full width, not a box on the word).

### Verification
* `text-shadow: none`, stroke 0. 1440: Cullinan is ink on the floor wash.

---

## [Motors] Hero title contrast is a paper bloom

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Removed `-webkit-text-stroke` on `.hero-title`.
* Contrast is a soft paper `text-shadow` bloom. Ink fill stays.

### Verification
* Computed stroke 0px. Shadow present. 1440 screenshot: no outline on Cullinan.

---

## [Motors] Lineup photo has no crop marks

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Removed `.crop` from the Lineup atelier hero.

### Verification
* `.lineup .atelier-hero .crop` is absent. One `.crop` remains on the WhatsApp form.

---

## [Motors] Phone Lineup overlay is brand and model only

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Phone Lineup `.atelier-meta` is type on the photo: Rolls-Royce + Cullinan.
* Specs, status, price, and CTA stay hidden. They remain on the vehicle page.
* Plate background and border are off. Height 42px (was 192).

### Verification
* 390: brand and name visible. Other children `display: none`. Hero href stays a vehicle URL.

---

## [Motors] Seek title is bold

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* `.seek-title` weight is 700. Phone inherits the same weight.

### Verification
* Computed `font-weight` on `.seek-title` is 700.

---

## [Motors] Seek title has more space below

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Under 1100px `.seek-title` has `margin-bottom: .55rem`.

### Verification
* 1075px: title 18px tall. Gap to first select 19px (was ~10px).

---

## [Motors] Desktop Seek is one row of selects plus button

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Below 1100px the title takes the full first row.
* Marque, Modèle, Budget, and « Voir le stock » stay on one grid row (`repeat(3, 1fr) auto`).
* Phone plate under 860px is unchanged.

### Verification
* 1100px: form height 123px (was 183). Columns `256 256 256 161`. Field bottoms all 1008.

---

## [Motors] Desktop hero uses the phone stack

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Hero copy is one column on the floor: arrival, model, make, CTA.
* Desktop no longer puts the make and button on the left wall.

### Verification
* 1440×900: arrival 596–614, Cullinan 628–762, Rolls-Royce 769–787, button 795–843. All left 65px. Stacked.

---

## [Motors] Phone Seek is a register plate

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Below 860px the search block is a title, one three-row plate, and a full-width « Voir le stock ».
* Desktop stays a single bar. `seek-plate` is `display: contents` at 1440.

### Verification
* 390: plate 354×165. Rows ~54px. Marque Rolls-Royce submits to `/mansour-motors/vehicules?marque=Rolls-Royce`.
* 1440: form height 94px, five columns.

---

## [Motors] Hero CTA is dark silver, no arrow

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Hero « Voir le véhicule » is dark nickel. No arrow.
* Shimmer stays on the plate. Other buttons stay ink.

### Verification
* Button text is `Voir le véhicule`. No `.arr`.
* Color `rgb(236, 234, 229)`. Fill now starts near `#4a4946` and bottoms at `#1c1b19`.
* Shine is soft 135° bands: faded stops, `blur(7px)`, `soft-light`. No hard lines.

---

## [Motors] Hero holds back price and stats

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Hero copy is arrival, model, make, and « Voir le véhicule ».
* Year, km, status, and price stay off the hero.

### Verification
* `/mansour-motors?h=1` hero text: Dernière arrivée à Dakar, Cullinan, Rolls-Royce, Voir le véhicule. No `.hero-kicker`.

---

## [Motors] Phone lineup is a photo + strip

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Below 860px the stock chapter is atelier: one photo, a swipe row, tap to open.
* No WebGL canvas on the phone. Plateau / Liste is hidden.
* Phone lead: « Glissez la rangée. Touchez la photo pour ouvrir. »
* Desktop keeps the hover ring.

### Verification
* 390×844: canvas `display:none`. Hero 390×422. Strip `clientWidth` 354, `scrollWidth` 1545. Title 20px below the header. Strip in the first viewport (703–833 in 844).
* Strip `data-i=1` then photo tap opens `/mansour-motors/vehicules/1d079cfc-35eb-45f7-b78d-b55520fc2210` (Autobiography LWB).
* 1440×900: `is-ring`, canvas 1434×900, atelier hidden, hover lead, Plateau/Liste visible.

---

## [Motors] Hero copy sits on the floor

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Arrival line captions the model name on the marble, not under the header.
* Header is clear at rest. Frost only after scroll.
* Phone: one stack at the bottom. Desktop: facts in the left wall, name on the floor.
* Copy unchanged.

### Verification
* Phone 390×844: arrival 652–670, title 673–714, CTA 776–826 (inside 844).
* Desktop 1440×900: facts 234–348, plaque 705–864. No overlap with the 68px header.

---

## [Motors] Hero signals latest arrival in Dakar

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Hero first line is « Dernière arrivée à Dakar » when that vehicle is the newest `createdAt`.
* The Cullinan still is unchanged. No pill, no gold.

### Verification
* `/mansour-motors?a=1`: region label includes « dernière arrivée à Dakar ». Visible line above Rolls-Royce.

---

## [Motors] Hero is the prestige car in stock

* **Status:** Completed
* **Date:** 2026-09-20

### What was done
* Hero copy binds to the Cullinan row (make, year, km, status, price, vehicle CTA).
* `prestige()` prefers the Rolls-Royce Cullinan, else the dearest available.
* Restored `public/mansour-motors/hero-still.jpg` to the approved black Cullinan (16:9).
* Added `hero-still-m.jpg` (9:16 outpaint of the same still) via `<picture>` at max-width 860px.
* Inserted VIN `SCA665C04SU100009` into live Postgres. No full reseed.

### Verification
* `/mansour-motors`: region Rolls-Royce Cullinan, `2025 · 80 km`, Disponible, `185 000 000 FCFA`.
* Desktop still is the Cullinan. Phone `currentSrc` is `hero-still-m.jpg` (1080×1920).
* Plateau 01 is the Cullinan. CTA opens `/mansour-motors/vehicules/fdd9fc65-7845-47eb-abe8-2719ded83fdf`.

---

## [Repo] Drop HTML prototypes

* **Status:** Completed
* **Date:** 2026-09-19

### What was done
* Removed `prototype/` (launch, showroom, nuit, mono, accrochage, piste, archives).
* Live app is the source. `.claude/launch.json` only starts `bun run dev`.

### Verification
* `git ls-files prototype` is empty. App comments no longer point at a deleted map script.

---

## [Copy] Showroom address is the Corniche

* **Status:** Completed
* **Date:** 2026-09-19

### What was done
* `PRODUCT.md` and `PublicFooter.tsx` now say Route de la Corniche Ouest, Almadies, Dakar.
* No leftover Avenue Cheikh Anta Diop in `src/` or `PRODUCT.md`.

### Open
* Old prototypes (`showroom/`, `nuit/`, `mono/`, `accrochage/`) still say Avenue Cheikh Anta Diop.

---

## [Motors] Header hydration

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* Nav `aria-current` waits for mount, so the server HTML matches the first client paint.
* Hours text still fills after mount (`OpenNote`).
* Prices and km use ASCII grouping, not `Intl.NumberFormat('fr-FR')`.

### Verification
* `/mansour-motors?h=1`: Accueil is current after mount. No Next issues overlay. Open note shows Dakar hours. Price `98 000 000 FCFA`.

---

## [Motors] Landing plane join + dry HUD

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* `--sheet: 0`. Statement no longer pulls over the plateau HUD.
* HUD and search dock are dry `--black` plates. Frost stays on the header only.
* Search dock is the hero’s last grid row, not an overlay on the plateau title.
* `.lineup` clips so the HUD does not smear into the header on exit.

### Verification
* Hero: dock at viewport bottom, plate above it, hairline join.
* Plateau: title and HUD full, no search dock, no frost on HUD.
* Statement start: HUD sits above the paper plane (21px gap). No white cover on « Voir le véhicule ».
* Photos left as-is. Catalog will replace them.

---

## [Motors] Plateau hover magnet

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* Home plateau `drive: 'hover'`. Lenis-style damp (duration 1.2). Neighbours pull toward the hovered plate.
* Wheel scrolls the page. Magnet only on a plate, off while scrolling.
* Draw loop stops when settled. Controls use `--r` (2px). Chapter overlap stays `--sheet`. No pills.

### Verification
* Rest HUD `01 / 08`. Hover a plate pans the fan. Wheel over the floor scrolls the page.

---

## [Motors] Port the launch design to the real app

* **Status:** Completed (branch `feat/motors-launch-port`)
* **Date:** 2026-09-18

### What was done
* `app/mansour-motors/motors.css`: prototype/launch/launch.css nested under `.mm`, so the dashboard keeps its styles. The `<use>` car rules stay unscoped (a shadow tree cannot be reached through `.mm`).
* `_ui/shell.tsx`: header (tone follows the chapter), footer, WhatsApp, car sprite; routes plain internal `<a>` links through the app router.
* Home, `/vehicules` and `/vehicules/[id]` ported with real data. `turntable.js` and `stock.js` stay imperative, load by dynamic import after mount, and clean every window listener on unmount.
* Lenis is skipped on `/mansour-motors` (the plateau eases the native scroll itself).
* Dashboard vehicle form: "sens du véhicule" and "cadrage" stored in `extras.face` / `extras.pos`, kept out of the features list (`VehicleForm.test.ts`).
* Old `MotorsNavbar` / `MotorsFooter` removed.

### Verification
* `bun run type-check` clean, `bun test src/components/motors/VehicleForm.test.ts` 2 pass, `bun run build` passes.
* Browser, 1440x900 and 375x812: plateau renders R2 photos (CORS fine), plan, map drive, alert preview, filters + URL sync (`?energie=diesel&vue=grille`, 4/8), in-app navigation to a detail page, visit slot message, not-found page.

### Open
* `bun run lint` crashes on the ESLint config (circular JSON), also on `main`.
* Seed data: some photos do not match their record (Range Rover shows an Audi). Staff must set `face` per photo in the dashboard for the plateau mirroring to be right.
* `PRODUCT.md` and `PublicFooter.tsx` still say Avenue Cheikh Anta Diop.
* Excon loads from the Fontshare CDN, not self-hosted.

---

## [Prototype] Showroom map, footer wordmark, chapter sheets

* **Status:** Completed (not committed)
* **Date:** 2026-09-18

### What was done
* Address: the showroom is at Route de la Corniche Ouest, Almadies (Plus Code PFPR+9J7, next to HEC Dakar), confirmed by the owner. All launch pages updated. `Itinéraire` opens the Plus Code.
* Showroom chapter: a map drawn from OpenStreetMap (coast, all streets, the Corniche in white). It fills the right of the chapter and fades out under the copy and at both edges. The top-down car from the floor plan drives up the Corniche as the chapter scrolls in and parks at the door. Reduced motion: parked. Phone: the map is a plate above the copy.
* `tools/showroom-map.py` rebuilds the SVG from Overpass data (query in the file). Output checked identical.
* Week: plain border, no glass. "aujourd'hui" label removed (it overflowed); the white cell and the day bar mark today.
* Footer: wordmark sized by formula to span the text column exactly, .02em tracking, baseline on the page edge (was 107 px too wide and 10 px cut). Blue glow and hairline removed.
* Chapters after the plateau (statement, showroom, alerte, footer) are sheets: each overlaps the one before with rounded top corners.

### Verification
* 1440x900: map pin at ~71% width, clear of the copy; car transform moves 597 -> 474 -> parked at 431 along the road.
* Wordmark 65 px to 1374 px (page margins 65 px), baseline offset 0.05 px.
* 375x812: no horizontal scroll, labels readable, address on 2 lines.
* No console errors.

### Open
* `PRODUCT.md` and the live app (`MotorsFooter.tsx`, `PublicFooter.tsx`, `landing.tsx`) still say Avenue Cheikh Anta Diop.
* Other prototypes (showroom/, nuit/, mono/, accrochage/) still say Avenue Cheikh Anta Diop.

---

## [Prototype] Statement plan, showroom day bar, alerte preview

* **Status:** Completed (not committed)
* **Date:** 2026-09-18

### What was done
* Statement: the "Dakar / Avenue" aside is replaced by a floor plan of the showroom. Two rows of four bays across an aisle, door on the avenue. One top-down SVG car per bay, nose to the aisle: solid = available, outline = reserved, dashed = sold. Each bay links to its car. Bays light one by one as the sentence inks in (they stay visible, only dimmed, before that).
* Removed the ornamental vertical rule on the statement.
* Showroom: plain `#050505` (the radial washes are gone). Today's column has a bar that fills from opening to closing time, Dakar time, updated each minute.
* Alerte: live preview of the WhatsApp message in WhatsApp's own outgoing bubble. One `alertText()` builds both the preview and the sent message.

### Verification
* 1440x900 and 375x812: plan fits, names readable, no horizontal scroll.
* Typing "Lexus LX 600" updates the preview line "Modèle : Lexus LX 600".
* Day bar at 0.103 around 9h (8h to 18h).
* No console errors.

### Open
* Showroom section is still mostly flat black around the week plate.
* Footer unchanged.

---

## [Prototype] Plateau: side cars face the front car

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* `data.js`: new `face` field (side the nose points to in the photo). Photos 3 (BMW) and 6 (Hilux) face right, the rest face left.
* Ring: side photos are mirrored so every car left of the front one faces right, and every car right of it faces left. The front car is never mirrored.
* A car that crosses sides turns around between 0.35 and 0.85 of a step, not in one frame. The scroll settle means no car rests half-turned.

### Verification
* Car 1 in front: all 7 side cars face left.
* Car 5 (Mercedes) in front: 4 cars on the left face right, 3 on the right face left.
* No console errors.

### Known limit
* Mirrored side photos also mirror badges and grille lettering. They are small and dimmed, so this is hard to see.

---

## [Prototype] Plateau: ticks, settle, a11y

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* One tick per car under the plateau. Each tick is a button that scrolls to that car. Screen readers hear "01, Range Rover Autobiography LWB".
* When the scroll rests between two cars, the page finishes the move to the nearest one. Not while a finger is on the screen.
* Scroll per car: 0.85 to 0.6 screen (8 cars: about 4 screens instead of 7).
* Arrow keys on the plateau work again (the scroll position overwrote them).
* A hidden live region reads the car once the plateau rests: "Véhicule 2 sur 8 : Lexus LX 600…, 78 000 000 FCFA".
* Removed the "Faites défiler…" hint (low contrast, repeated the lead, overlapped the HUD on phones). Removed the HUD drop shadow.
* Phone HUD: one column, name on one line, a lane kept free for the WhatsApp button. Plateau/Liste and "Tout le stock" share one row.
* Lenis: not added. The ring already eases to the scroll; a second smoothing layer makes it lag behind the finger.

### Verification
* 1440x900: stop at 1.4 cars, settles on car 2. Tick 5 goes to the Mercedes. Arrow right goes to car 6.
* 375x812: HUD clear of the WhatsApp button, no overlap with the plateau head.
* No console errors.

---

## [Prototype] Plateau studio light

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* Dropped the Cursor wash pass (drifting blobs, chapter crop marks, showroom glow line). It read as random decoration.
* Plateau ring (WebGL) now stands in a studio: a gloss floor, a mirrored reflection under each car panel, and a softbox panel over the selected car. The softbox and its floor light follow the selection as you scroll.
* Portrait screens skip the softbox: no free band exists between the page head and the cars. Floor and reflections stay.
* Removed the CSS glow line under the ring and the radial washes on the line-up.

### Verification
* 1440x900: softbox over the front car, light pool and reflections on the floor, no overlap with the heading or the Plateau/Liste switch.
* 375x812: no softbox, reflections visible, head controls readable.
* No console errors on `/launch/` and `/launch/vehicules/`.

### Open
* Statement, showroom, alerte and footer are unchanged (flat or faint washes from the last commit).

---

## [Prototype] Launch plateau order and atelier

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* Home photo slider is a front fan, not a closed ring. Scroll walks **01 → 02 → 03 … 08**. All eight plates stay in front of the camera.
* HUD ticks on each car. Drag and wheel snap to a plate.
* Véhicules is an atelier: one large plate plus a filmstrip. Anneau is gone on that page. Liste and Grille remain.

### Verification
* Browser 1325: home HUD 01 Range Rover, 04 Jaguar, 08 Land Cruiser ZX. Eight plates visible at 04.
* `/launch/vehicules/`: Atelier opens on first available (Jaguar). Strip click → BMW 06/08. Mercedes filter → `?marque=Mercedes-Benz`, 1/8 GLE.
* Liste shows the eight rows. 390px stacks Filtres.

---

## [Prototype] Launch glass, glow, WhatsApp disc

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* WhatsApp is a 56px round green disc (`#25D366`) with `aria-label`.
* Frost on header, search dock (over the plate), ring HUD, week plaque, photo bar, filter bar.
* Studio key/fill radials on hero, ring, showroom, footer. Floor line carries bounce light.

### Verification
* Computed: WA 50% / rgb(37,211,102); dock `blur(22px)` absolute; header frost. Visit dual glow visible. 390px WA at bottom. Detector: pre-existing fly layout-transition and empty hero `src` (filled by JS).

---

## [Prototype] Launch brand language

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* Launch controls use plate geometry: nested square arrows, drawn underlines, 2px corners.
* Chapters differ: crop-marked plate, ring floor line, typeset statement, week plaque, paper form sheet, wordmark clip.
* Film grain overlay. Header tone samples at header height. No gold. No second WebGL.

### Verification
* Browser 1440: nested-arrow buttons, crop marks on hero/week/form, search Jaguar → `/launch/vehicules/?marque=Jaguar`. Header dark on showroom. Today plaque shows all 7 days. Detail `/launch/vehicule/?id=2` paper panel. 390px stacks type, CTA, plate, search.

---

## [Prototype] Launch plates and hero scale

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* Eight stock photos restaged onto black 4:3 studio plates in `prototype/media/cars/`.
* Hero is a type rail over a full-bleed plate. Search stays in the first chapter.
* Ring camera looks at the front plane, tighter radius, steeper neighbour dim.

### Verification
* Browser 1440: hero rail + large studio plate. Search submit → `/launch/vehicules/?marque=Mercedes-Benz` (GLE 01/01). Ring: one front car, raked neighbour. Detail `/launch/vehicule/?id=2` uses the same plate. 390px stacks type, CTA, plate, search.

---

## [Prototype] Launch hero plate

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* Home hero is one 4:3 plate on black. Search lives in that chapter. The four-slide carousel is gone.
* The plate is the same car and crop as the ring front. Scroll fades the plate into the ring.

### Verification
* Browser: hero plate + search in 100svh. Search submit → `?marque=Mercedes-Benz`. Plate opens `/vehicule/?id=2`. Ring front is the same Range Rover. 390px stacks type, plate, figures, search.

---

## [Prototype] Launch WebGL turntable

* **Status:** Completed
* **Date:** 2026-09-18

### What was done
* `prototype/launch/` line-up is a photo ring. Scroll orbits it on home. Drag orbits it on stock.
* Liste and Grille remain as usable fallbacks. Click flies the panel into the detail page.
* Filter rebuild no longer drops Anneau (stale texture load ignored). HUD clears the WhatsApp chip.

### Verification
* Browser: home pin-orbit (desktop + 390px). Stock Anneau, Liste, Grille. Mercedes filter = 01/01 GLE. Detail after HUD click.

---

## [Perf] Grouped sales board load

* **Status:** Completed
* **Date:** 2026-09-17

### What was done
* `/dashboard/motors/sales` loads all deals once, grouped by status.
* Header counts come from the same load. Optimistic column moves stay on the client.

### Verification
* `bun run type-check`
* Browser: `/dashboard/motors/sales` shows Prospect, Négociation, Conclu, Perdu (0 deals)

---

## [Perf] Server-render public vehicle detail

* **Status:** Completed
* **Date:** 2026-09-17

### What was done
* `/mansour-motors/vehicules/[vehicleId]` loads the vehicle and 5 related cars on the server.
* Missing id calls `notFound()`. ISR `revalidate = 60`.

### Verification
* `bun run type-check`
* Browser: known vehicle first paint; unknown id shows not found

---

## [Perf] Server-render motors landing featured cars

* **Status:** Completed
* **Date:** 2026-09-17

### What was done
* `/mansour-motors` loads 5 available vehicles in the server page.
* Client landing only handles motion. ISR `revalidate = 60`.

### Verification
* `bun run type-check`
* Browser: featured cars on first paint

---

## [Perf] Server-render public catalog

* **Status:** Completed
* **Date:** 2026-09-17

### What was done
* `/mansour-motors/vehicules` loads vehicles in the server page.
* Client catalog only filters and animates. ISR `revalidate = 60`.

### Verification
* `bun run type-check`
* Browser: catalog shows vehicles on first paint

---

## [Perf] Batch dashboard reads

* **Status:** Completed
* **Date:** 2026-09-17

### What was done
* Holding and Motors dashboards each call one overview action.
* Counts come from SQL. Motors loads 5 deals and 3 vehicles, not 100 + 20.
* Writes call `invalidateMotorsQueries` so overview stays fresh.

### Verification
* `bun run type-check`
* Browser: `/dashboard` and `/dashboard/motors`

---

## [Hygiene] Drop Hono for Next.js server actions

* **Status:** Completed
* **Date:** 2026-09-17

### What was done
* Vehicles, customers, and deals run as server actions in `src/server`.
* better-auth uses `toNextJsHandler` at `/api/auth/[...all]`.
* Removed Hono, CORS, the catch-all route, and in-memory rate limit.
* `GET /api/health` stays a Next.js route handler.

### Verification
* `bun run type-check`
* Browser: public vehicles, login, dashboard list

---

## [Hygiene] Colocate pages in App Router

* **Status:** Completed
* **Date:** 2026-09-17

### What was done
* Each route is one file under `src/app/**/page.tsx`. Deleted `src/views`.
* `/vehicules` now redirects to `/mansour-motors/vehicules`.

---

## [Hygiene] Flatten repo to a single Next.js app

* **Status:** Completed
* **Date:** 2026-09-17

### Decision
GitHub Actions CI was redundant. Vercel runs `next build` on git push. `apps/web` nesting was leftover from the old monorepo.

### What was done
* Deleted `.github/workflows/ci.yml`
* Moved the Next.js app from `apps/web` to the repo root
* Vercel Root Directory is the repo root. Import the GitHub project and set env vars.

---

## [Hygiene] Drop unused packages and dead files

* **Status:** Completed
* **Date:** 2026-09-17

### What was done
* Deleted `packages/shared`, `packages/database`, and `packages/domain`
* Moved Zod create/update schemas into `apps/web/src/server/schemas.ts`
* One Drizzle schema file: `apps/web/src/server/db/schema.ts`
* Removed unused UI (`AuthGuard`, `CustomCursor`, `scroll.ts`) and one-shot DB scripts
* CI workflow is `.github/workflows/ci.yml` (type-check only)

---

## [Infrastructure] Next.js on Vercel — single app

* **Status:** Completed
* **Date:** 2026-09-17

### Decision
Mansour Motors is a small product. Two hosts (Vercel SPA + Koyeb API) added CORS, bearer tokens, and two env dashboards. Next.js now owns pages and `/api`.

### What was done
* Converted `apps/web` from Vite + TanStack Router to Next.js App Router
* Moved Hono, Drizzle, better-auth, and R2 upload into `apps/web/src/server`
* Same-origin cookies. Dropped bearer plugin and `VITE_API_URL`
* Removed `apps/api` and the Koyeb deploy path

### Verification
* `bun run --cwd apps/web type-check` passes
* `bun run --cwd apps/web build` passes
* Browser: `/`, `/mansour-motors`, `/mansour-motors/vehicules`, `/api/health`, login to `/dashboard`

### Local
* `bun run --cwd apps/web dev` on port 3000
* Env file: `apps/web/.env.local`

### Vercel
Copy Koyeb env vars onto the Vercel project. Set `BETTER_AUTH_URL` and `FRONTEND_URL` to `https://mansour-holding.vercel.app`.

---

## [UX] Customer Edit/Delete + Dashboard Navigation

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* Customer detail page now has full edit mode (inline form, same pattern as vehicle detail)
* Customer delete with confirmation dialog
* "Créer une affaire" button now links to deal creation page (was dead)
* Motors dashboard KPI cards are now clickable — link to inventory, sales, customers
* Added "Voir tout" link to top vehicles sidebar section
* Top vehicles now link to their detail pages

### Changes
* `apps/web/src/pages/dashboard/motors/MotorsCustomerDetail.tsx` — Full rewrite: edit mode, delete with confirm, working action buttons
* `apps/web/src/pages/dashboard/motors/MotorsDashboard.tsx` — KPI cards link to pages, "Voir tout" on vehicles section

### Verification
* ✅ `bunx tsc -b` passes in `apps/web`
* ✅ `bunx tsc --noEmit` passes in `apps/api`

---

## [UX] Confirmation Dialogs for Destructive Actions

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* Created reusable `ConfirmDialog` component with French UI
* Replaced browser `confirm()` with custom dialog in vehicle delete flow
* Added loading state during deletion
* Dialog includes title, message, confirm/cancel buttons, and variant styling

### Changes
* `apps/web/src/components/ui/ConfirmDialog.tsx` — New reusable confirmation dialog
* `apps/web/src/pages/dashboard/motors/MotorsVehicleDetail.tsx` — Replaced `confirm()` with `ConfirmDialog`

### Dialog features
* Animated backdrop and modal (Framer Motion)
* Three variants: danger (red), warning (yellow), info (gold)
* Loading state with disabled buttons
* French labels: "Confirmer", "Annuler", "En cours..."
* Luxury design matching app theme (noir-900 background, gold accents)

### Verification
* ✅ `bunx tsc --noEmit` passes in `apps/web`
* ✅ Vehicle delete now shows confirmation dialog before deletion
* ✅ Holding dashboard already wired with live Motors data (revenue, vehicles, customers)

### Notes
* Customer and deal delete don't exist yet (no delete buttons in UI)
* Holding dashboard Motors card shows live data; other business cards are placeholder (as intended)

---

## [Security + UX] Rate Limiting, Error Boundary, Dead Code Cleanup

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* Added in-memory rate limiting middleware (100 requests per 15 minutes per IP)
* Created React ErrorBoundary component with French error UI
* Removed mock data fallback from PublicVehicleDetail (all vehicles now UUID-based)
* Deleted dead code file `apps/web/src/data/mock.ts`

### Changes
* `apps/api/src/middleware/rateLimit.ts` — New rate limiting middleware with configurable windows
* `apps/api/src/index.ts` — Applied rate limiting globally (100 req/15min)
* `apps/web/src/components/ErrorBoundary.tsx` — New error boundary with French UI
* `apps/web/src/main.tsx` — Wrapped app with ErrorBoundary
* `apps/web/src/pages/public/PublicVehicleDetail.tsx` — Removed mock fallback, UUID-only
* Deleted `apps/web/src/data/mock.ts`

### Rate limiting details
* Window: 15 minutes
* Limit: 100 requests per IP
* Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`
* Response: 429 with retry-after seconds
* Note: In-memory store (for production, consider Redis)

### Error boundary features
* Catches all React errors app-wide
* French error message: "Une erreur s'est produite"
* Shows technical details in collapsible section
* Refresh button to reload page
* Luxury design matching app theme

### Verification
* ✅ `bunx tsc --noEmit` passes in `apps/api`
* ✅ `bunx tsc --noEmit` passes in `apps/web`

### Remaining polish items
* Confirmation dialogs for destructive actions
* Holding dashboard live data for Motors card

---

## [Security] API Input Validation with Zod

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* Added Zod validation to all API POST/PUT endpoints across vehicles, customers, and deals routes
* Updated `@mansour/shared` schemas to properly omit server-side fields (`createdBy`, `salesPersonId`)
* Added `extras` field to vehicle schema (was missing from Zod but exists in DB)
* All validation errors now return structured 400 responses with error details
* Added null checks for session user IDs to prevent undefined values

### Changes
* `apps/api/src/routes/vehicles.ts` — POST/PUT now validate with `createVehicleSchema`/`updateVehicleSchema`
* `apps/api/src/routes/customers.ts` — POST/PUT now validate with `createCustomerSchema`/`updateCustomerSchema`
* `apps/api/src/routes/deals.ts` — POST/PUT now validate with `createDealSchema`/`updateDealSchema`
* `packages/shared/src/schemas/vehicle.ts` — Added `extras`, `createdBy` fields, omit `createdBy` from create
* `packages/shared/src/schemas/deal.ts` — Omit `salesPersonId` from create (set server-side)

### Validation examples
* Invalid vehicle year: `{"error":"Validation failed","details":[{"path":["year"],"message":"Number must be greater than or equal to 1900"}]}`
* Missing required field: `{"error":"Validation failed","details":[{"path":["make"],"message":"Required"}]}`
* Invalid email: `{"error":"Validation failed","details":[{"path":["email"],"message":"Invalid email"}]}`

### Verification
* ✅ `bunx tsc --noEmit` passes in `apps/api`
* ✅ `bunx tsc --noEmit` passes in `apps/web`

### Next priorities
* Rate limiting on API endpoints
* React error boundary
* Remove mock data fallback and dead code

---

## [Checkpoint] Post-PRD Polish — Real Data Everywhere + Performance

* **Status:** Completed
* **Date:** 2026-03-28
* **Commits:** `c09e87d` → `2574f33`

### Summary
All mock data eliminated from the app. Every page now fetches from the real API.

### Changes since last checkpoint
* Holding dashboard (`/dashboard`) wired to real API — KPIs show live revenue, vehicle count, customer count, deal stats
* Public vehicle detail "Autres véhicules" section now fetches real available vehicles from API (was mock)
* Public vehicle detail: extras moved from specs strip to dedicated "Équipements" section in content area
* Cache invalidation audit: fixed vehicle create not invalidating list, deal moves not invalidating summary, customer detail still on old fetch pattern
* Seeded 8 real Mansour Motors vehicles with Unsplash images and extras

### Current state
* 27/27 PRD tasks complete
* Zero mock data in any live page (mock only used as fallback for legacy `v1`/`v2` URLs)
* TanStack Query on all data-fetching pages
* Route code-splitting: 289KB core + per-page chunks
* DB indexes on vehicles and customers tables
* R2 image upload working (local + production)

---

## [Performance + Data] TanStack Query, Code Splitting, Motors Dashboard Wired

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* Installed `@tanstack/react-query` — replaced all manual `useState`/`useEffect` fetch loops across 8 pages
* Route code-splitting via `React.lazy` + `Suspense` — bundle went from 773KB single chunk to 289KB core + 5-23KB per page
* API cache headers (`Cache-Control: public, max-age=60, stale-while-revalidate=300`) on public vehicle GET endpoints
* DB indexes: `vehicles(status)`, `vehicles(make,model)`, `customers(email)`, `customers(phone)`, `customers(name)` — pushed to Neon
* Preconnect hints for Koyeb API, Unsplash, R2 in `index.html`
* Image lazy loading (`loading=lazy`, `decoding=async`) on all vehicle thumbnails
* `MotorsDashboard` fully wired to real API — KPIs, pipeline, recent deals, top vehicles all live
* Cache invalidation audit: fixed 4 issues (vehicle create, vehicle update/delete/upload not invalidating public + list caches, customer detail still on old pattern, deal moves not invalidating summary)
* Seeded 8 real Mansour Motors vehicles (LC300, Range Rover, BMW X7, Lexus LX, Mercedes GLE, Hilux, Jaguar F-Pace, LC300 ZX)
* Public catalog + landing page wired to real API

### PRD completion: 27/27 tasks ✅

### Next priorities (beyond PRD)
* Holding overview dashboard wired to real API (currently placeholder — acceptable per PRD)
* Customer create form
* Toast on all remaining mutation flows
* Image reordering (drag to reorder gallery)

---

## [Feature] Vehicle Full CRUD + Image Upload

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* API: `POST /api/vehicles/:id/images` — multipart → S3Client → R2 → appends URL to `images[]` in DB
* API: added R2 env var stubs to `apps/api/.env` (commented, needs real values)
* Web: `VehicleForm` shared component (`apps/web/src/components/motors/VehicleForm.tsx`) — React Hook Form, all fields, French labels
* Web: `MotorsVehicleNew` at `/dashboard/motors/inventory/new` — creates vehicle, redirects to detail
* Web: `MotorsVehicleDetail` — full view/edit toggle, delete with confirm dialog, image upload via hidden file input
* Web: "Ajouter un véhicule" button in inventory list now links to `/new`
* Router: added `motorsVehicleNewRoute`

### R2 setup required (before image upload works)
Fill in `apps/api/.env`:
- `R2_ENDPOINT` — from Cloudflare dashboard → R2 → Manage R2 API tokens
- `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` — R2 API token
- `R2_BUCKET_NAME=mansour-assets`
- `R2_PUBLIC_URL` — enable public access on the bucket, copy the URL

### Verification
* ✅ `bunx tsc --noEmit` passes in `apps/api`
* ✅ `bunx tsc --noEmit` passes in `apps/web`

### Next
* Sales pipeline API + Kanban board

---

## [Feature] Customer CRUD API + Pages

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* Created `apps/api/src/routes/customers.ts` — 5 endpoints, auth-gated, search by firstName/lastName/email/phone via `ilike`, pagination
* Mounted at `/api/customers` in `index.ts`
* Added `ApiCustomer`, `CustomerSource`, `customersApi` to `apps/web/src/lib/api.ts`
* Built `MotorsCustomers.tsx` — TanStack Table, debounced search, pagination, French labels (Nom, Email, Téléphone, Source, Ajouté le)
* Built `MotorsCustomerDetail.tsx` — contact info, notes, source/date meta, action buttons
* Added `/motors/customers/$customerId` route to `router.tsx`

### Verification
* ✅ `bunx tsc --noEmit` passes in `apps/api` (exit code 0)
* ✅ `bunx tsc --noEmit` passes in `apps/web` (exit code 0)

### Next
* Sales pipeline API endpoints (`apps/api/src/routes/deals.ts`) + Kanban board

---

## [Feature] Vehicle List + Detail Pages

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* Created `apps/web/src/lib/api.ts` — typed fetch client with bearer token support, `vehiclesApi.list/get/create/update/delete`
* Rewrote `MotorsInventory.tsx` to fetch from `GET /api/vehicles` with:
  - Debounced search (300ms), status filter buttons, pagination controls
  - Loading spinner, error banner, empty state
  - TanStack Table with image thumbnail, make/model, year, mileage, price, status columns
* Rewrote `MotorsVehicleDetail.tsx` to fetch from `GET /api/vehicles/:id` with:
  - Image gallery with thumbnail strip
  - Specs grid with French labels (fuelType/transmission mapped to French)
  - Loading/error/not-found states

### Verification
* ✅ `MotorsInventory.tsx` uses `useReactTable`, fetches from `/api/vehicles`
* ✅ Search, status filter, pagination all wired
* ✅ `MotorsVehicleDetail.tsx` fetches from `/api/vehicles/:id`
* ✅ `bunx tsc --noEmit` passes in `apps/web` (exit code 0)

### Next
* Customer CRUD API endpoints (`apps/api/src/routes/customers.ts`)

---

## [Feature] Vehicle CRUD API Endpoints

* **Status:** Completed
* **Date:** 2026-03-28

### What was done
* Created `apps/api/src/routes/vehicles.ts` with all 5 CRUD endpoints:
  - `GET /api/vehicles` — list with pagination (`page`, `limit`) and filters (`status`, `search`)
  - `GET /api/vehicles/:id` — single vehicle by UUID
  - `POST /api/vehicles` — create, sets `createdBy` from session
  - `PUT /api/vehicles/:id` — update, strips immutable fields, bumps `updatedAt`
  - `DELETE /api/vehicles/:id` — delete, returns 404 if not found
* All routes protected by auth middleware using `auth.api.getSession()`
* Mounted at `/api/vehicles` in `apps/api/src/index.ts`

### Verification
* ✅ `apps/api/src/routes/vehicles.ts` exists with all 5 endpoints
* ✅ Auth middleware applied to all routes via `vehiclesRoute.use('*', ...)`
* ✅ Pagination (`page`, `limit`, `offset`) on list endpoint
* ✅ Routes mounted in `index.ts` via `app.route('/api/vehicles', vehiclesRoute)`
* ✅ `bunx tsc --noEmit` passes in `apps/api` (exit code 0)

### Next
* Vehicle list page with TanStack Table at `/dashboard/motors/inventory`

---

## [Infrastructure] Koyeb Deployment + Auth Cross-Domain Fix

* **Status:** Completed
* **Date:** 2026-03-28
* **Commits:** `64a2338` → `f3ee1a0`

### Journey summary
Started with Cloudflare Workers, hit CPU limit on free tier (better-auth too heavy for 10ms limit). Moved to Railway, hit trial expiry. Landed on **Koyeb** (free tier, always-on, no credit card).

### Final production stack
* **Frontend:** `https://mansour-holding.vercel.app` (Vercel)
* **API:** `https://integral-adel-wadeweb-04b62073.koyeb.app` (Koyeb, Bun HTTP server)
* **Database:** Neon PostgreSQL (serverless)
* **Storage:** Cloudflare R2 `mansour-assets` (pending image upload implementation)

### Changes made
* Reverted API from Cloudflare Workers back to standard Bun HTTP server (`export default { port, fetch }`)
* Reverted DB driver from `@neondatabase/serverless` back to `postgres.js`
* Removed Workers-specific lazy proxy pattern from `db/index.ts` and `auth.ts`
* Added `Dockerfile` using `oven/bun:1` base image for Koyeb Docker builder
* Fixed `--frozen-lockfile` issue (local Bun 1.2.4 vs Koyeb Bun 1.3.11 lockfile format mismatch)
* Added `bearer()` plugin to better-auth for cross-domain token auth (Vercel ↔ Koyeb)
* Updated frontend `auth.ts` client to attach `Authorization: Bearer` token from localStorage
* Set `sameSite: none, secure: true` on cookies for cross-domain support
* Hardcoded Koyeb URL in CORS `allowed` list and `trustedOrigins`
* Updated GitHub Actions CI to type-check only (Koyeb auto-deploys from GitHub push)

### Env vars on Koyeb
```
DATABASE_URL=<Neon connection string>
BETTER_AUTH_SECRET=<secret>
BETTER_AUTH_URL=https://integral-adel-wadeweb-04b62073.koyeb.app
FRONTEND_URL=https://mansour-holding.vercel.app
NODE_ENV=production
PORT=3000
```

### Env vars on Vercel
```
VITE_API_URL=https://integral-adel-wadeweb-04b62073.koyeb.app
```

### Verification
* ✅ `GET /api/health` returns `{"status":"ok"}`
* ✅ Koyeb health checks passing
* ✅ Login flow working cross-domain via bearer token
* ✅ `bunx tsc --noEmit` passes in both `apps/api` and `apps/web`

---

## [Infrastructure] CI/CD + Deployment Stabilization

* **Status:** Completed
* **Date:** 2026-03-27
* **Commits:** `87658dd` → `5bdf22e`

### What was done
* Migrated API from Bun HTTP server to **Cloudflare Workers** with Neon HTTP driver (`@neondatabase/serverless`) — Workers doesn't support TCP so `postgres.js` had to go
* Fixed Workers validation-time crash: `db` and `auth` were initializing at module load (throwing on missing env vars before secrets are injected). Wrapped both in lazy `Proxy` pattern so they only initialize on first request
* Added `wrangler.toml` with R2 bucket binding (`mansour-assets`) for future image uploads
* Set up **GitHub Actions** CI workflow (`.github/workflows/deploy-api.yml`) — auto-deploys Worker on push to `main` when `apps/api/**`, `packages/**`, or `bun.lock` change
* Fixed Workers bundler error: `apps/api/src/db/schema.ts` was re-exporting from `@mansour/database` workspace package whose `dist/` doesn't exist in CI — redirected to local `schema-for-migrations.ts`
* Fixed Vercel build: Zod v4 (`3.25.x`) was resolving via `better-auth` transitive deps, breaking `@hookform/resolvers` type compatibility. Resolved by removing `zod` and `@hookform/resolvers` from auth forms entirely — switched to `react-hook-form` native validation (no external schema library needed for simple auth forms)
* Added `installCommand: bun install --no-cache` to `apps/web/vercel.json` to prevent Vercel from using stale cached lockfiles

### Production URLs
* **Frontend:** `https://mansour-holding.vercel.app`
* **API:** `https://mansour-api.mansour-holding.workers.dev`

### Secrets configured on Worker
* `DATABASE_URL` — Neon PostgreSQL
* `BETTER_AUTH_SECRET`
* `BETTER_AUTH_URL` — `https://mansour-api.mansour-holding.workers.dev`
* `FRONTEND_URL` — `https://mansour-holding.vercel.app`

### Vercel env vars required
* `VITE_API_URL=https://mansour-api.mansour-holding.workers.dev`

### GitHub secrets required
* `CLOUDFLARE_API_TOKEN` — Edit Cloudflare Workers template token

### Verification
* ✅ `bun run deploy` succeeds locally
* ✅ GitHub Actions deploys Worker on push
* ✅ Vercel builds frontend cleanly
* ✅ `bunx tsc --noEmit` passes in both `apps/api` and `apps/web`

---

## [Infrastructure] Cloudflare Workers Deployment

* **Status:** Completed
* **Date:** 2026-03-27
* **Summary:** Migrated API from Bun HTTP server to Cloudflare Workers. API is now live at `https://mansour-api.mansour-holding.workers.dev`.

### Changes
* Swapped `postgres.js` driver for `@neondatabase/serverless` (Neon HTTP driver — required for Workers edge runtime, no TCP)
* Made DB and auth initialization lazy via `Proxy` pattern — Workers validates modules at deploy time before secrets are injected, so top-level throws on missing env vars would crash the deploy
* Updated `drizzle.config.ts` to use `dialect: 'postgresql'` and `url` (new drizzle-kit API)
* Replaced Bun HTTP server export (`export default { port, fetch }`) with plain Hono app export (`export default app`) for Workers compatibility
* Added `wrangler.toml` with R2 bucket binding (`mansour-assets`) and Workers config
* Added `wrangler` as dev dependency, updated scripts: `dev` now uses `wrangler dev`, added `deploy`
* Added production `trustedOrigins` to better-auth: `mansour-holding.vercel.app` and `mansour-api.mansour-holding.workers.dev`

### Cloudflare Resources Created
* Workers subdomain: `mansour-holding.workers.dev`
* Worker: `mansour-api` → `https://mansour-api.mansour-holding.workers.dev`
* R2 bucket: `mansour-assets` (for future vehicle image uploads)

### Secrets configured on Worker
* `DATABASE_URL` — Neon PostgreSQL connection string
* `BETTER_AUTH_SECRET` — auth signing secret
* `BETTER_AUTH_URL` — `https://mansour-api.mansour-holding.workers.dev`
* `FRONTEND_URL` — `https://mansour-holding.vercel.app`

### Vercel action required
* Add env var `VITE_API_URL=https://mansour-api.mansour-holding.workers.dev` and redeploy

### Verification
* ✅ `bunx tsc --noEmit` passes in `apps/api`
* ✅ `bun run deploy` succeeds — Worker live at `https://mansour-api.mansour-holding.workers.dev`
* ✅ Dry-run bundle: 500.59 KiB gzipped

### Next
* Verify `/api/health` on production URL
* Test auth (login/register) on live Vercel frontend against live Worker
* Then proceed to Vehicle CRUD API endpoints

---

This file tracks all implementation cycles, decisions, and learnings during development.

---

## [Bug Fix] Dashboard Redirect Infinite Update Loop

* **Status:** Completed
* **Date:** 2026-03-27
* **Issue:** Visiting [`/dashboard`](apps/web/src/router.tsx:118) while unauthenticated redirected to [`/login`](apps/web/src/router.tsx:76) but also threw `Maximum update depth exceeded` from TanStack Router transition handling.
* **Root Cause:** [`DashboardLayout()`](apps/web/src/components/layout/DashboardLayout.tsx:26) rendered [`<Navigate />`](apps/web/src/components/layout/DashboardLayout.tsx:45) directly from the protected layout while the session hook was resolving the unauthorized dashboard route. That render-time redirect path could repeatedly trigger router state updates during the same transition.
* **Fix Applied:**
  - Replaced render-time [`<Navigate />`](apps/web/src/components/layout/DashboardLayout.tsx:45) usage in [`DashboardLayout()`](apps/web/src/components/layout/DashboardLayout.tsx:26) with an effect-driven [`useNavigate()`](apps/web/src/components/layout/DashboardLayout.tsx:2) redirect
  - Used `replace: true` so the unauthorized dashboard entry is removed from history during redirect to [`/login`](apps/web/src/router.tsx:76)
  - Returned `null` for the unauthorized render branch so the layout no longer tries to mount while navigation is being committed
* **Verification Results:**
  - ✅ `cd apps/web && bunx tsc --noEmit` passes
  - ✅ Browser check: opening `http://localhost:5173/dashboard` as an unauthenticated user lands on the login page without the previous infinite update console error
* **Result:** Success - unauthenticated dashboard access now redirects cleanly to login without triggering the React maximum update depth failure

---

## [Bug Fix] Runtime Auth Schema Mismatch

* **Status:** Completed
* **Date:** 2026-03-27
* **Issue:** [`bun run db:seed`](apps/api/package.json:14) still failed after moving to [`auth.api.signUpEmail()`](apps/api/src/db/seed.ts:1) with `PostgresError: invalid input syntax for type uuid`.
* **Root Cause:** Runtime Drizzle schema exported by [`packages/database/src/schema/auth.ts`](packages/database/src/schema/auth.ts:1) did not match the migrated auth tables. The package schema used plural table names with UUID auth IDs, while the actual auth migration and better-auth runtime expect singular tables with string IDs.
* **Fix Applied:**
  - Align shared auth schema in [`packages/database/src/schema/auth.ts`](packages/database/src/schema/auth.ts:1) with the real migration structure
  - Switched auth IDs and foreign keys from UUID to varchar(36)
  - Renamed shared auth tables to singular names: `user`, `session`, `account`, `verification`
  - Updated references in [`packages/database/src/schema/vehicles.ts`](packages/database/src/schema/vehicles.ts:1) and [`packages/database/src/schema/deals.ts`](packages/database/src/schema/deals.ts:1)
  - Added better-auth advanced database ID generation in [`apps/api/src/auth.ts`](apps/api/src/auth.ts:15) so runtime-created auth records use UUIDs compatible with the current schema expectations
* **Verification Results:**
  - ✅ [`bunx tsc --noEmit`](apps/api/package.json:11) passes in [`apps/api`](apps/api/package.json)
  - ✅ [`bunx tsc --noEmit`](apps/web/package.json:11) passes in [`apps/web`](apps/web/package.json)
  - ✅ [`bun run db:seed`](apps/api/package.json:14) completed successfully
  - ✅ Frontend auth basics were browser-tested: login, logout, and protected-route redirection
* **Result:** Success - auth runtime schema, ID generation, and seed flow are now aligned with better-auth and verified

---

## [Bug Fix] Auth Seed Password Hash Compatibility

* **Status:** Completed
* **Date:** 2026-03-27
* **Issue:** Login failed with `BetterAuthError: Invalid password hash` after the origin fix was applied.
* **Root Cause:** [`apps/api/src/db/seed.ts`](apps/api/src/db/seed.ts) was creating auth records manually and hashing passwords with bcrypt. better-auth expects passwords to be created through its own signup flow so the stored hash format matches its verifier.
* **Fix Applied:**
  - Removed manual bcrypt hashing and direct account insertion from [`apps/api/src/db/seed.ts`](apps/api/src/db/seed.ts)
  - Reused [`auth.api.signUpEmail()`](apps/api/src/auth.ts:10) from better-auth to create the admin user with the correct password hash format
  - Added cleanup logic in the seed so an existing admin user and related auth records are deleted before recreating the account with a valid hash
* **Verification Results:**
  - ✅ `cd apps/api && bunx tsc --noEmit` passes
* **Result:** Success - seeded admin credentials are now compatible with better-auth sign-in

---

## [Bug Fix] Auth "Invalid origin" 403 Error

* **Status:** Completed
* **Date:** 2026-03-27
* **Issue:** Login requests returning `403 Forbidden` with "Invalid origin" error
* **Error:** `POST http://localhost:3000/api/auth/sign-in/email 403 (Forbidden)`
* **Root Cause:** better-auth requires `trustedOrigins` configuration to allow cross-origin requests. The frontend runs on `http://localhost:5173` while the API runs on `http://localhost:3000`. Without explicit trusted origins, better-auth rejects all cross-origin auth requests.
* **Fix Applied:**
  - Added `trustedOrigins` array to `apps/api/src/auth.ts` betterAuth configuration
  - Includes `FRONTEND_URL` env variable (defaults to `http://localhost:5173`)
  - Also explicitly includes `http://localhost:5173` and `http://localhost:3000` as fallbacks
* **Files Modified:**
  - `apps/api/src/auth.ts` - Added trustedOrigins configuration
* **Verification:**
  - ✅ Type check passes: `cd apps/api && bunx tsc --noEmit` (exit code 0)
* **Result:** Success - Auth requests from frontend origin are now accepted

---

## [Feature] Complete Auth Implementation + Monorepo Infrastructure

* **Status:** Completed
* **Date:** 2026-03-27
* **Commit:** `71f722b` - feat: complete monorepo scaffolding and auth implementation
* **Summary:** Completed all infrastructure tasks and full authentication system implementation.

### Infrastructure Changes
* **Monorepo Setup:**
  - Root `package.json` with Bun workspaces (`apps/*`, `packages/*`)
  - Root `tsconfig.json` with project references
  - Updated `.gitignore` to exclude dist, build, and IDE files
* **packages/shared:** Zod validators for all entities
  - `idSchema` - UUID validation
  - `userSchema`, `createUserSchema`, `updateUserSchema` - User validation
  - `vehicleSchema`, `createVehicleSchema`, `updateVehicleSchema` - Vehicle validation
  - `customerSchema`, `createCustomerSchema`, `updateCustomerSchema` - Customer validation
  - `dealSchema`, `createDealSchema`, `updateDealSchema` - Deal validation
  - All enums exported (userRole, vehicleStatus, fuelType, transmission, customerSource, dealStatus)
* **packages/database:** Drizzle ORM schemas
  - `auth.ts` - Users, Sessions, Accounts, Verifications tables for better-auth
  - `vehicles.ts` - Vehicles table with enums (status, fuelType, transmission)
  - `customers.ts` - Customers table with source enum
  - `deals.ts` - Deals table with status enum and FK relationships
  - Migration file `0000_first_spectrum.sql` generated
* **packages/domain:** Placeholder package ready for business logic
* **apps/api:** Hono framework with full auth setup
  - Health check endpoint at `GET /api/health`
  - Database connection using Drizzle + postgres.js
  - better-auth configured with Drizzle adapter at `/api/auth/*`
  - CORS and logger middleware
  - Migration, seed, and utility scripts

### Authentication Implementation
* **Server-side (apps/api):**
  - `auth.ts` - better-auth configuration with email/password provider
  - Drizzle adapter connected to PostgreSQL
  - Session management with secure cookies
  - Environment-based configuration for secrets and baseURL
* **Client-side (apps/web):**
  - `lib/auth.ts` - better-auth React client with `signIn`, `signUp`, `signOut`, `useSession`
  - `components/auth/AuthGuard.tsx` - Protected route component
  - `pages/auth/LoginPage.tsx` - Functional login with React Hook Form + Zod
  - `pages/auth/RegisterPage.tsx` - Functional registration with name support
* **Dashboard Integration:**
  - `DashboardLayout.tsx` - Full auth integration with user display and logout
  - Redirects to `/login` when not authenticated
  - Shows user initials, name, and email in sidebar
  - Logout button with error handling

### UX Improvements
* Fixed French typography (space before colons: `Filtres actifs :`)
* Standardized filter labels (consistent `Toutes les...` pattern)
* Updated CTA copy (`Demander des informations` vs `Acquérir ce véhicule`)
* Fixed React Hook violations in `PublicVehicleDetail.tsx`

### Verification Results
* ✅ `bun install` succeeds from root
* ✅ `bunx tsc --noEmit` passes for root and all packages
* ✅ `cd apps/web && bunx tsc --noEmit` passes
* ✅ `cd apps/api && bunx tsc --noEmit` passes
* ✅ Auth routes mounted at `/api/auth/*`
* ✅ Login/Register pages connected to better-auth client
* ✅ Dashboard protected with auth check

### PRD Tasks Completed
* ✅ Monorepo project structure
* ✅ Web app foundation (already existed)
* ✅ API foundation (Hono + Drizzle)
* ✅ Shared packages setup
* ✅ Database schema for auth (better-auth tables)
* ✅ better-auth server configuration
* ✅ Auth UI (login and register pages)
* ✅ Protected routes and auth guard
* ✅ Dashboard shell layout (auth integrated)

### Next Priority
1. Connect dashboard pages to real API endpoints (replace mock data)
2. Implement Vehicle CRUD API endpoints
3. Implement Vehicle list/detail pages with TanStack Table
4. Implement Customer CRUD
5. Implement Sales/Deals pipeline

---

## [UX] Vehicles Page Copy Clarity Improvements

* **Status:** Completed
* **Date:** 2026-03-27
* **Task:** Review and improve UX copy clarity on `/mansour-motors/vehicules` per clarify skill guidelines
* **Issues Identified:**
  1. **Inconsistent Filter Labels** - "Toutes les marques" had descriptive prefix, but "Année", "Carburant", "Transmission" were bare nouns
  2. **Inconsistent Clear/Reset Terminology** - "Effacer les filtres" vs "Réinitialiser les filtres" created confusion
  3. **Price Format Mismatch** - Input used "(FCFA)" but displayed prices use "F CFA" format
  4. **Search Placeholder** - Used ellipsis (...) which is less clear than explicit "ou"
  5. **French Typography** - Missing space before colon in "Filtres actifs:"
* **Changes Applied to `apps/web/src/pages/public/PublicVehicles.tsx`:**
  - `Rechercher par marque, modèle...` → `Rechercher par marque ou modèle` (explicit, no ellipsis)
  - `Effacer les filtres` → `Réinitialiser les filtres` (consistent with empty state button)
  - `Filtres actifs:` → `Filtres actifs :` (French typography - space before colon)
  - `Année` → `Toutes les années` (consistent filter pattern)
  - `Carburant` → `Tous les carburants` (consistent filter pattern)
  - `Transmission` → `Toutes les transmissions` (consistent filter pattern)
  - `Prix maximum (FCFA)` → `Prix maximum (F CFA)` (matches displayed price format)
* **Additional Changes to `apps/web/src/pages/public/PublicVehicleDetail.tsx`:**
  - `Acquérir ce véhicule` → `Demander des informations` (more professional, clearer intent)
  - **Fixed React Hook violations**: Moved `useState` and `useCallback` hooks before the early return to comply with React Rules of Hooks
* **Principles Applied (from clarify skill):**
  - **Be consistent**: All filter labels now follow same "Toutes les..." pattern
  - **Be specific**: Search placeholder uses "ou" instead of vague ellipsis
  - **Be concise**: Maintained brevity while improving clarity
* **Verification Results:**
  - ✅ Type check passes: `cd apps/web && bunx tsc --noEmit` (exit code 0)
* **Result:** Success - Filter UX copy is now consistent and clearer

---

## [Bug Fix] TypeScript Import Extension Errors (Project-wide)

* **Status:** Completed
* **Date:** 2026-03-27
* **Issue:** TypeScript errors: `Cannot find module '.../.js'` across multiple packages. Affected files reported in packages/shared, packages/database, apps/api, and apps/web.
* **Root Cause:** Import statements used `.js` extensions when referencing TypeScript files (`.ts`). While ES modules conventionally use `.js` extensions for the compiled output, TypeScript's module resolution with `"moduleResolution": "bundler"` couldn't resolve these imports during type checking.
* **Fix Applied:**
  - Removed `.js` extensions from all local TypeScript imports project-wide
  - Files modified:
    - `packages/shared/src/index.ts` (5 imports)
    - `packages/shared/src/schemas/vehicle.ts` (1 import)
    - `packages/shared/src/schemas/user.ts` (1 import)
    - `packages/shared/src/schemas/customer.ts` (1 import)
    - `packages/shared/src/schemas/deal.ts` (1 import)
    - `packages/database/src/index.ts` (4 imports)
    - `packages/database/src/schema/vehicles.ts` (1 import)
    - `packages/database/src/schema/deals.ts` (3 imports)
    - `apps/api/src/index.ts` (2 imports)
    - `apps/api/src/auth.ts` (2 imports)
    - `apps/api/src/db/index.ts` (1 import)
    - `apps/api/src/db/delete-admin.ts` (1 import)
    - `apps/api/src/db/seed.ts` (1 import)
    - `apps/api/src/db/verify-admin.ts` (1 import)
* **Verification Results:**
  - ✅ `npx tsc --build` from root passes with exit code 0
  - ✅ No TypeScript errors across all packages
* **Result:** Success - All module resolution issues resolved project-wide

---

## [Infrastructure] Monorepo Setup Complete

* **Status:** Completed
* **Date:** 2026-03-27
* **Changes:**
  - Created root `package.json` with Bun workspaces configuration (`apps/*`, `packages/*`)
  - Created root `tsconfig.json` with project references for all packages
  - Set up `packages/shared` with Zod validators:
    - `idSchema` - UUID validation
    - `userSchema`, `createUserSchema`, `updateUserSchema` - User validation
    - `vehicleSchema`, `createVehicleSchema`, `updateVehicleSchema` - Vehicle validation
    - `customerSchema`, `createCustomerSchema`, `updateCustomerSchema` - Customer validation
    - `dealSchema`, `createDealSchema`, `updateDealSchema` - Deal validation
    - All enums exported (userRole, vehicleStatus, fuelType, transmission, customerSource, dealStatus)
  - Set up `packages/database` with Drizzle ORM schemas:
    - `auth.ts` - Users, Sessions, Accounts, Verifications tables for better-auth
    - `vehicles.ts` - Vehicles table with enums (status, fuelType, transmission)
    - `customers.ts` - Customers table with source enum
    - `deals.ts` - Deals table with status enum and FK relationships
  - Set up `packages/domain` as placeholder for business logic
  - Created `apps/api` with Hono framework:
    - Health check endpoint at `GET /api/health`
    - Database connection module using Drizzle + postgres.js
    - Migration script using Drizzle Kit
    - CORS middleware configured
    - Logger middleware
* **Verification Results:**
  - ✅ `bun install` succeeds from root
  - ✅ `bun run build` succeeds for all packages
  - ✅ `bun run type-check` passes for all packages
  - ✅ `bunx tsc --noEmit` from root compiles successfully
  - ✅ All workspace packages are importable
* **PRD Tasks Completed:**
  - ✅ Monorepo project structure
  - ✅ Web app foundation (already existed)
  - ✅ API foundation (Hono + Drizzle)
  - ✅ Shared packages setup
* **Result:** Success - Infrastructure is ready for auth implementation

---

## [Status Check] Project State Analysis

* **Status:** Completed
* **Date:** 2026-03-27
* **Git State:**
  - Branch: `main`
  - Ahead of origin by 4 commits (unpushed work)
  - Working tree clean (no uncommitted changes)
  - Recent work: Racing/carbon theme redesign, Vercel SPA config, Lenis scroll, icon migrations
* **PRD Task Completion:**
  - ✅ Completed: 4/25 tasks (16%)
  - ❌ Not Started: 21/25 tasks (84%)
* **Completed Tasks (public website):**
  1. Holding landing page (`/`) - Luxury design with Playfair Display, noir/gold theme
  2. Mansour Motors business landing (`/mansour-motors`) - Brand positioning, services, showroom
  3. Public vehicle listing (`/mansour-motors/vehicules`) - Filter, search, vehicle cards
  4. Public vehicle detail (`/mansour-motors/vehicules/$vehicleId`) - Gallery, specs, contact form
* **Frontend Implementation Status:**
  - Framework: React 19 + Vite + TanStack Router
  - Styling: TailwindCSS 4 with custom noir-950/gold-400 theme
  - Animation: Framer Motion + Lenis smooth scroll
  - Icons: Phosphor Icons + HugeIcons
  - Dashboard UI: Complete with mock data (Inventory, Sales, Customers)
  - Auth UI: Login/Register pages exist but not functional
* **Critical Gaps Identified:**
  - ❌ No root package.json (not a proper Bun monorepo)
  - ❌ No apps/api folder (no backend)
  - ❌ No packages/* folders (no shared code)
  - ❌ No database schema or migrations
  - ❌ No authentication implementation
  - ❌ All dashboard data is mock data
* **Next Priority:**
  1. Set up proper monorepo structure with root package.json and workspaces
  2. Create apps/api with Hono + Drizzle foundation
  3. Set up packages/shared, packages/database, packages/domain
  4. Implement auth schema and better-auth integration
  5. Connect dashboard UI to real API endpoints

---

## [Decision] Public Route Architecture Reframe

* **Status:** Confirmed
* **Date:** 2026-03-16
* **Decision:**
  * Public routes must be organized by business namespace instead of exposing standalone offering routes as primary entry points.
  * The holding website remains the root public entry at `/`.
  * Each business gets a dedicated public landing page and route family (example: `/mansour-motors/*`).
  * Vehicle discovery becomes a subpath of the Mansour Motors public site instead of the main public identity.
* **Implications:**
  * Existing public Motors route direction changes from `/vehicules` to `/mansour-motors/vehicules`.
  * A new Motors brand landing page at `/mansour-motors` becomes a required deliverable.
  * Public navigation, content strategy, SEO structure, and future business expansions must follow the same holding → business → offering hierarchy.
  * Future public business sites should mirror this route strategy (`/mansour-immobilier`, `/mansour-location`, etc.).

---

## [Feature] Public Vehicles Catalog (Motors)

* **Status:** Completed
* **Date:** 2026-02-16
* **Changes:**
  * Implemented `/vehicules` page with luxury "Dark Mode" aesthetic (Noir-950 background).
  * Created `PublicNavbar` and `PublicFooter` shared components for consistency with Landing Page.
  * Added advanced filtering for vehicles: Make, Year, Fuel, Transmission, and Price Max.
  * Built responsive `VehicleCard` with hover effects, status badges, and price formatting.
  * Implemented `/vehicules/$vehicleId` detail page with:
    * Sticky contact sidebar (Lead capture form + Direct contact links).
    * Immersive hero image and editorial typography.
    * Detailed specs grid using Phosphor Icons.
  * Ensured full responsiveness and smooth Framer Motion transitions.
* **Follow-up Decision:**
  * This work should be repositioned under the Mansour Motors public namespace during the next public-route implementation pass.
  * Target path family is now `/mansour-motors/vehicules/*` rather than standalone `/vehicules/*`.
* **Tech Stack:** React 19, TailwindCSS 4, Framer Motion, Phosphor Icons.

## [Feature] Luxury Landing Page Redesign

* **Status:** Completed
* **Date:** 2026-02-16
* **Changes:**
  * Migrated from blue SaaS palette to `noir-950` + `gold-400` luxury identity.
  * Implemented editorial layout with `Playfair Display` serif typography.
  * Added `Lenis` for smooth scrolling and `Framer Motion` for cinematic reveals.
  * Created `CustomCursor` and `MagneticButton` interactions.
  * Replaced static grid with asymmetrical bento layout for business portfolio.
  * Refined Hero copy to "L'Autorité De l'Excellence Durable" with brand-aligned typography.
  * Improved contrast on Stats slider (`text-white/50`) and filled gaps in Portfolio grid.
  * Updated About section with distinct radial gradient background (`bg-noir-900`).
  * Aligned navigation labels to holding-level terminology: Portfolio, Accès, Espace Pro.
  * Applied brand voice guidelines: authoritative, precise, uppercase tracked nav (0.2em).
  * Fixed descender cropping in hero headline with proper line-height.
* **Brand Alignment:**
  * Hero follows "Prestige + Authority" pillars from brand definition.
  * Typography uses Sans Extrabold for main headline, Serif Italic for accents.
  * Supporting copy emphasizes unified portfolio and sovereign vision.
  * Navigation uses overline style (11px, SemiBold, 0.08em tracking) per brand spec.

## [Feature] Public Vehicle Detail Page Migration

* **Status:** Completed
* **Date:** 2026-03-16
* **Changes:**
  - Added new route at `/mansour-motors/vehicules/$vehicleId` in router configuration
  - Reused existing `PublicVehicleDetail` component (already had all required features)
  - Updated vehicle card links in `PublicVehicles` to point to new namespace
  - Updated featured vehicle links in `MansourMotorsLanding` to use new detail route
  - Kept old `/vehicules/$vehicleId` route for backward compatibility
  - Component already includes: hero image, specs table (year, mileage, fuel, transmission, color, VIN), contact form (name, phone, email, message), French labels
* **Verification Results:**
  - ✅ Public vehicle detail route exists at `/mansour-motors/vehicules/$vehicleId` — verified with grep
  - ✅ Photo gallery component — verified image display (line 77)
  - ✅ Specs table with all vehicle fields — verified with grep (lines 43-48: year, mileage, fuel, transmission, color, VIN)
  - ✅ Contact form with name, email, phone, message — verified with grep (lines 156, 161, 166, 171)
  - ✅ French labels — verified with grep ('Nom complet', 'Téléphone', 'Email professionnel', 'Message')
  - ✅ Type check passes: `cd apps/web && bunx tsc --noEmit` (exit code 0)
* **Result:** Success

---

## [Feature] Public Vehicle Listing Page Migration

* **Status:** Completed
* **Date:** 2026-03-16
* **Changes:**
  - Added new route at `/mansour-motors/vehicules` in router configuration
  - Reused existing `PublicVehicles` component (already had all required features)
  - Updated links in `MansourMotorsLanding` to point to new `/mansour-motors/vehicules` route
  - Kept old `/vehicules` route for backward compatibility
  - Component already includes: filter controls (make, model, year, fuel, transmission, price), vehicle cards with images/specs, French labels
* **Verification Results:**
  - ✅ Public vehicles route exists at `/mansour-motors/vehicules` — verified with grep
  - ✅ No auth guard on this route — route is outside dashboard layout (defined at root level)
  - ✅ Filter controls for make, model, price, year — verified with grep (lines 130-134, 249-257)
  - ✅ Vehicle cards with image, price, specs — verified with grep (lines 67-109)
  - ✅ French labels — verified with grep ('Disponible', 'Réservé', 'Vendu', 'Rechercher', 'Filtres')
  - ✅ Type check passes: `cd apps/web && bunx tsc --noEmit` (exit code 0)
* **Result:** Success

---

## [Feature] Mansour Motors Business Landing Page

* **Status:** Completed
* **Date:** 2026-03-16
* **Changes:**
  - Created `MansourMotorsLanding` component at `apps/web/src/pages/public/MansourMotorsLanding.tsx`
  - Added route at `/mansour-motors` in router configuration
  - Implemented hero section with "L'Excellence Automobile à Dakar" positioning
  - Built featured vehicles section with 3-card grid and CTA to catalog
  - Created services section showcasing: Vente de Véhicules, Service Après-Vente, Solutions de Financement, Location de Véhicules
  - Added contact/showroom section with address, hours, phone, and email
  - Maintained luxury design system (noir-950, gold-400, Playfair Display serif)
  - Used Lenis smooth scrolling and Framer Motion animations for premium feel
  - All French labels throughout
  - Links temporarily point to `/vehicules` (will be migrated to `/mansour-motors/vehicules` in next task)
* **Verification Results:**
  - ✅ Business landing route exists at `apps/web/src/pages/public/MansourMotorsLanding.tsx`
  - ✅ Page presents Mansour Motors brand positioning beyond inventory (hero, services, showroom sections)
  - ✅ Featured vehicles section exists with CTA to catalog
  - ✅ Services section exists (vente, location, SAV, financement)
  - ✅ Contact and showroom information exists (address, hours, phone, email)
  - ✅ Type check passes: `cd apps/web && bunx tsc --noEmit` (exit code 0)
* **Result:** Success

---

## [Init] Ralph Initialization

* **Status:** Success
* **Started:** 2026-02-12 19:22
* **Note:** Created prd.json with 25 tasks across 8 groups (scaffolding, auth, layout, motors-inventory, motors-crm, motors-sales, motors-dashboard, motors-website, holding-website). Tech stack configured for Mansour Holding (Bun monorepo, React 19 + Vite, Hono API, Drizzle + PostgreSQL, better-auth). Phase 1 focus: Mansour Motors (car dealership). French is primary UI language.
