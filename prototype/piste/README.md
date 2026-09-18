# La Piste — Mansour Motors

Dakar at two in the afternoon. The parc is not a page, it is a piste, and the machines
live inside the heat rising off the tar.

**Speed makes heat. Stillness makes clarity.**

Plain HTML, CSS and one ES module with a raw WebGL shader. No build step, no
dependencies, no libraries.

## Run

```bash
bunx serve -p 3008
```

from `prototype/`, then open **http://localhost:3008/piste/**
(`/` is prototype A, the Carnet de Route.)

## The two systems

**The piste.** Momentum physics on one axis. Wheel, trackpad, drag, arrow keys and the
ticks all push the same velocity. Friction bleeds it off, and below a threshold the
piste brakes into the nearest machine. The edges damp, so you cannot fling past the end.

**The mirage.** A WebGL fragment shader. Layered value noise displaces the sampled
photograph, strongest low in the frame where the air is hottest. Below the mirage line
the image is sampled *inverted* and dissolved into the tar — which is what a real mirage
is, the car reflected by a layer of hot air, not a wobble filter. Heat follows your
speed, so the shimmer boils while you move and falls away when you stop. Glare washes
the colour out at speed and lets it back in as you settle.

**The reward.** Hold still for a third of a second after the machine resolves: the price
counts on and a gold rule draws under its name. The desert gives the machine up only to
someone who stops.

## Verifications

**The drive**
1. Drag the image left and right. The piste follows your pointer one to one, then carries
   on with momentum when you let go.
2. Flick hard. The shimmer boils, colour washes out, and the `Chaleur` gauge on the right
   rises. Let it settle: heat falls, colour returns, the machine sharpens.
3. Stop between two machines. It brakes into the nearer one on its own.
4. Drag *over the readout at the bottom*. The piste still moves — only the call button
   takes the pointer.
5. Arrow keys step one machine at a time. `Home` and `End` jump to the ends.
6. Press a tick along the bottom. It drives there.
7. Try to fling past machine 08. The end damps instead of snapping.

**The mirage**
8. Look at the bottom quarter while moving: the machine appears inverted in the tar, and
   it boils harder than the machine above it, because the air is hottest at the ground.
9. The gold rake falls from the upper left across every machine. It is one light source,
   not a glow behind the subject.

**The reward**
10. Stop on a machine and watch the name: a gold rule draws under it and the price counts
    onto its final value. Move again and the rule retracts.
11. Machine 08 is sold: the call button leaves the readout and its tick greys out.

**It holds up**
12. `prefers-reduced-motion` on, reload: heat is pinned to zero, movement is instant,
    every figure reads at its final value.
13. Open the console. If WebGL is unavailable it logs one warning and renders the same
    machine as a sharp photograph, with every readout and control working.
14. Phone width: drag with a finger. The heat gauge steps aside, the readout stacks, and
    the shimmer itself carries the idea.
15. Resize the window mid-drive. The canvas re-scales and the machine stays cover-fitted.

## Honest gaps

- **Photography is the ceiling, again, and it matters most here.** Model-accurate
  Wikimedia Commons files, but daylight snapshots. This direction wants machines shot on
  tar in hard Dakar light. The shader is doing work the photography should be sharing.
- **The mirage line is fixed at 23% of the frame.** With a real shoot it would sit on the
  actual horizon in each photograph.
- **One machine is in frame at a time**, with its neighbour crossfading past. A deeper
  version would render several down the piste with true depth parallax.
- **No-JS shows the shell only.** In production this is server-rendered by Next.js and
  the shader is an enhancement on top.
- **Waypoint 08 is shown as `sold`** to exercise that state; the seed row says `reserved`.
  Several `color` values match the sourced photograph rather than the seed.
- No claim here is invented. Every figure comes from the seed rows.
