# E. L'Accrochage

The stock is an exhibition. Eight machines hang in a soft, curved gallery, each in a
recessed niche behind slight glass, each with a wall label. Sold works stay on the wall
with a red dot, as in any gallery.

Plain HTML, CSS and one ES module. No build step, no dependencies. Reuses `../data.js`.

## Run

From `prototype/`:

```bash
bunx serve -p 3008
```

Open http://localhost:3008/accrochage/

## Verifications

**Entrée**
1. First screen: the wall lettering « Huit machines », the address bottom left, the room
   text bottom right. Two ceiling lights switch on, one after the other, on load.
2. The count line under the room text reads `7 disponibles, 1 vendue.` (from data).
3. Top right: the open state is computed from the real hours in Dakar time
   (for example `Ouvert, jusqu'à 18h` or `Fermé, ouvre demain à 8h`).

**The spotlight (the one mechanism)**
4. Scroll slowly. The work at the eye-line is fully lit. The works above and below dim,
   but stay visible.
5. Watch the glass on a frame while you scroll past it. The reflection slides across.
6. The downlight on the wall above each niche brightens as the work arrives.
7. The top bar centre reads `Salle 03 / 08` etc., then `Liste des œuvres` and
   `Visite privée` in those sections.
8. All niches share one eye-line. Left and right hangs alternate, and some works are
   smaller, as in a real hang.

**The cartel**
9. Each label: N°, make, model and year in italic, energy and gearbox, colour, km, the
   note, the price.
10. N° 08 carries the full red dot. It has no booking link, and it reads `Vendue`.

**Liste des œuvres**
11. Filter by `Diesel`, `Essence`, `Hybride`. Then press `Disponibles`. N° 08 leaves.
12. Press `Prix` three times: ascending, descending, back to hang order.
13. Press a machine name. The page scrolls to its work on the wall.

**Visite privée**
14. On a work, press `Demander une visite privée`. The form opens with that machine
    selected, and the invitation card writes the machine line in gold ink.
15. Pick a day, then an hour. Only hours inside the opening hours appear. Today only
    shows slots at least one hour from now. Sunday never appears.
16. Type a name. The invitation card updates as you type.
17. Submit with no slot: an inline message asks for what is missing.
18. Submit complete: WhatsApp opens with the message prefilled.

**It holds up**
19. `prefers-reduced-motion` on: no light switch-on, no travelling reflection, no ink
    animation. Everything reads.
20. Phone width: the cartel sits under each work, the price list drops to two columns
    with a meta line, the day tiles wrap to 3 per row, no horizontal scroll.

## Honest gaps

- **Photography is still the ceiling.** The frames help: the photos are smaller than a
  full-bleed hero, and the dimming hides weak edges. A real shoot still lifts it most.
- **Phone numbers are placeholders** taken from the current site (`+221 33 123 45 67`,
  WhatsApp `+221 77 123 45 67`). Replace them before any real use.
- **No reserved work in the data**, so the half red dot for `reserved` is built but not
  visible. Waypoint 08 is `sold` (the seed row says `reserved`), as in the other
  prototypes.
- **Notes come from the seed without accents** (`differentiel`, `Livre`). They are shown
  as stored.
- **No-JS shows the wall, the list shell and the form shell only.** In production the
  hang is server-rendered, and the spotlight is an enhancement on top.
