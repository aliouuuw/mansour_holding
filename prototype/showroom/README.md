# F. Showroom

A dealership site that a buyer can use. Three pages, one shared data file (`../data.js`).

- **IA** is borrowed from avantgarde.com.br: search first, a featured stage, a stock row,
  « Vous ne trouvez pas votre modèle ? », and a detail page with a sticky info column
  and section tabs.
- **Finish** is from Polestar / Tesla: light studio, few words, large figures, and a
  mobile price bar.
- **From the brief:** brand gold for actions only, soft-UI controls, a slight glass
  header, and Satoshi.
- **One bespoke silhouette:** the key cut, a step taken out of the top-right corner of
  every button and photo frame, like the blade of a car key.

Plain HTML, CSS and ES modules. No build step, no dependencies.

## Run

From `prototype/`:

```bash
bunx serve -p 3008
```

Open http://localhost:3008/showroom/

## Verifications

**Accueil** (`/showroom/`)
1. The first screen shows the search panel and the featured stage together.
2. Search: pick `Toyota`. The model list unlocks and shows the three Toyota models.
   Press `Rechercher`. The stock page opens, already filtered.
3. Stage: the gold line fills over 7 seconds, then the next car arrives. Hover the stage
   and the line stops. The arrows and the keyboard arrows change car.
4. « En stock au showroom » shows the 4 cars that are not on the stage. N° 08 shows
   `Vendu` and a struck price.
5. « Vous ne trouvez pas votre modèle ? »: submit it empty and a message asks for the
   model. Submit it filled and WhatsApp opens with the request written out.
6. The open state (header, statement, Horaires) follows the real hours, in Dakar time.
7. Scroll past the top. The header turns into a slight glass bar.

**Véhicules** (`/showroom/vehicules.html`)
8. Change any filter. The cards travel to their new places, and the count updates in
   the title.
9. `Disponibles uniquement` removes N° 08. `Hybride` leaves only the GLE.
10. Set a price range with no match. The empty state offers `Être prévenu`.
11. Change the sort. The cards move into the new order.
12. The URL follows the filters. Copy it, open it in a new tab, and the same result
    comes back.
13. Phone width: the filters fold into a `Filtres` panel that shows the active count.

**Détail** (`/showroom/vehicule.html?id=2`)
14. The left column stays in view while the photos scroll.
15. The tabs (Photos, Caractéristiques, Description, Visite) highlight the section you
    are reading. The gold bar slides under the active tab.
16. The photo counter and its line follow the photo in view (`01 / 03`).
17. Réserver une visite: only open days and opening hours appear. Today only shows
    slots at least one hour from now. Sunday never appears. Submit with no slot and a
    message asks for one.
18. Open `?id=8` (sold): no visit section, no Visite tab, and the action becomes
    `Être prévenu d'un modèle similaire`.
19. Phone width: swipe the photos sideways. Scroll past the price, and a bottom bar
    arrives with the price and `Réserver une visite`.

**It holds up**
20. `prefers-reduced-motion` on: no autoplay, no card travel, no rising sections.
    Everything reads.

## Honest gaps

- **Photography is still the ceiling, and the light theme shows it more.** Avantgarde
  looks clean because every car is a studio cutout. These are street photos in cut
  frames. The next step is the cutout test (about 20 minutes, quality not certain).
- **One photo per car in `data.js`.** The detail gallery shows 3 framings of the same
  photo to exercise the counter. The database already stores an ordered image array.
- **The detail facts** show only the fields in the record. The `extras` field in the
  database would add more rows in production.
- **Phone numbers are placeholders** taken from the current site.
- **« le showroom vous recontacte »** describes a process the showroom must actually
  follow. Confirm it, or change the copy.
- **Hero layout.** Text on the left and the car on the right, as on Avantgarde. You chose
  this reference layout. It is also a very common layout.
- **No-JS** shows the page chrome and forms only. In production the pages are
  server-rendered by Next.js.
