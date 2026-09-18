# Console — prototype B

The public layer as a console you operate, not a page you scroll.
Plain HTML, CSS and one ES module. No build step, no dependencies.

## Run

```bash
bunx serve -p 3008
```

from `prototype/`, then open **http://localhost:3008/neo/**
(`/` is prototype A, the Carnet de Route.)

## What changed from the previous version

The previous scroll-sequence version is kept intact at `prototype/_archive/neo-v1/`.
This is a different information architecture, not a restyle.

| | v1 (archived) | this version |
|---|---|---|
| IA | one linear scroll narrative | four modules behind a dock, linkable by URL |
| Navigation | scroll position | dock, cards, hash routes (`#parc`, `#fiche`, `#comparer`, `#showroom`) |
| Selection | implied by scroll depth | explicit, persistent, carried by the action bar across every module |
| Comparison | none | side-by-side on one aligned grid, best value per row marked |
| Conversion | a button inside a section | a fixed action bar that always shows the machine and its price |

## Where the UI comes from

**CleanMyMac:** the left dock with counts per module, the scan moment (one big radial
meter that reads the state of everything at a glance), soft rounded modules on a calm
ground, tonal elevation instead of drop shadows, one prominent primary action.

**Asian EV configurators (NIO, Li Auto, Xiaomi SU7):** oversized tabular numerals with
small unit suffixes, the segmented control, the paint chip under the vehicle, and the
sticky bottom bar that carries the selection and the price wherever you go.

Brand holds throughout: warm noir ground, ivory readouts, gold as the single accent.

## Verifications

**Parc**
1. Load. The meter fills and lands on **7** with a mute remainder for the one sold
   machine. The four readouts count up and stop on real values.
2. `Valeur du parc` is the sum of the seven available machines, not all eight.
3. Hover a card: it lifts tonally and its photo comes up to full colour. No drop shadow
   bloom, no bounce.
4. Press any card. It opens the Fiche for that machine and the dock moves with you.

**Fiche**
5. The paint chip under the photo shows that machine's colour, and the chassis number
   sits opposite it.
6. The segmented control moves between `Donnees`, `Notes`, `Dans le parc`. The indicator
   travels; it never resizes.
7. `Dans le parc` ranks all eight by price, with the current machine picked out in gold.
   Check its position is genuinely correct.

**Comparer**
8. Pick two, then three. The fourth is disabled: three columns is the limit.
9. On `Prix` and `Compteur` the lowest is marked `meilleure`; on `Annee` the highest is.
10. Deselect to one machine: no row is marked, because there is nothing to compare.
11. Every row lines up across all columns even though `Chassis` is long and `Annee` is
    short. Alignment does not depend on copy length.

**The console**
12. The action bar never leaves. Switch modules and it still carries the selected
    machine, its year, compteur, state and price.
13. Press the bar body (not the button): it takes you to that machine's Fiche.
14. Select machine 08. It is sold, so the call button disappears from the bar.
15. The URL updates to `#fiche`, `#comparer`, `#showroom`. Reload on one: it opens there.
16. Phone width: the dock becomes a bottom tab bar with its counts, and the action bar
    sits above it. No horizontal scroll.
17. `prefers-reduced-motion` on, reload: everything reads at its final value, no motion.

## Honest gaps

- **Photography is still the ceiling.** Model-accurate Wikimedia Commons files, but
  snapshots rather than art direction. A configurator UI wants a turntable and a studio
  set; that needs a real shoot.
- **No 360 turntable and no colour switching.** Both are core to the Asian configurator
  language, and both need per-machine photography that does not exist yet.
- **No-JS renders the shell only.** Modules are drawn from `../data.js` by the script. In
  production this is server-rendered by Next.js.
- **`swatch` is design material**: a hex approximation of the colour name for the paint
  chip, not a manufacturer paint value.
- **Waypoint 08 is shown as `sold`** to exercise that state; the seed row says `reserved`.
  Several `color` values match the sourced photograph rather than the seed.
- No claim here is invented. Every figure comes from the seed rows.
