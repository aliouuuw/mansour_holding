# Le Poste de Conduite — prototype B

The public layer as the vehicle's own HMI, from ignition to road. Plain HTML, CSS and
one ES module. No build step, no dependencies.

## Run

```bash
bunx serve -p 3008
```

from `prototype/`, then open **http://localhost:3008/neo/**
(`/` is prototype A, the Carnet de Route.)

## The motion law

Every animation here is something a cockpit actually does. If a movement could not be
justified by that sentence, it was cut.

| What moves | The cockpit behaviour it comes from |
|---|---|
| Gauge sweeps to full, then drops to 7/8 | the instrument self-test at ignition |
| Road drifts slower than the scroll | parallax at speed |
| The parc steps, one machine at a time | thumbing through a cluster menu |
| Gold leader lines draw onto the machine | a HUD annotating what is in front of you |
| Figures count and settle on a value | instruments coming to rest |
| Gold light strengthens near the viewport centre | the cabin lamp |
| Bars fill one after another | a readout initialising |

Nothing fades content into existence. `--near`, `--step` and `--draw` drive material,
tone and transform only, never the opacity of text.

## Verifications

**Ignition**
1. Reload. The ring sweeps to full, holds, then falls to **7**. The three readouts count
   up and stop on the real values: 28 000 000 / 98 000 000 / 32 300.
2. The ring lands on 7 of 8, not 8. Seven machines are available, one is sold.

**The parc**
3. Scroll into `Le parc`. The panel pins and the machines step through under you. The
   step counter top-left goes 01 to 08.
4. Each time a machine arrives, light rakes across the paint once, and the price counts
   to its new value rather than cutting.
5. The gold leader lines and their three labels draw in as each machine settles, and
   already carry that machine's real compteur, année and boîte.
6. Press any satellite at the bottom. The page scrolls to that machine's step. The
   control and the pinned sequence never disagree.
7. Tab to a satellite, then use the left and right arrows. Same behaviour, keyboard only.
8. Machine 08 shows `Vendu`, its flag on the satellite, and no call button.

**The readout**
9. `Parcours du parc` fills its bars in sequence once, then the total counts to 32 300.
   Every number is the real compteur, nothing rounded.

**The cockpit itself**
10. The rail on the right tracks which part of the sequence you are in.
11. Every panel carries the same chamfered corner, at every scale: HUD, stage, wells,
    keys, satellites. Zoom in on a cut and check the content clears it.
12. Press and hold a gold key. It depresses. Release and it returns.
13. Turn on `prefers-reduced-motion` (macOS: System Settings > Accessibility > Display >
    Reduce motion). Reload. Everything still reads, at its final value, with no motion.
14. Phone width: the HUD stacks, the key goes full width, the callouts step aside and the
    dials carry that information instead. No horizontal scroll.

## Honest gaps

- **Photography is still the ceiling.** Model-accurate Wikimedia Commons files, but
  snapshots, not art direction. In this direction the photo is the whole surface, so a
  real shoot matters more here than in prototype A.
- **No-JS renders the hero only.** The satellites, dials and bars are drawn from
  `../data.js` by the module. In production this is server-rendered by Next.js, so the
  full page exists before any script runs.
- **The callouts project at fixed HUD positions**, the way a real head-up display does.
  They do not point at specific body parts, because the photographs vary.
- **Waypoint 08 is shown as `sold`** to exercise that state; the seed row says `reserved`.
  Several `color` values are set to the colour of the sourced photograph.
- No claim on this page is invented. Every figure comes from the seed rows.
