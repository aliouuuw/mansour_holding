# H. Mono

The IA of the Showroom direction, rebuilt in light monochrome.

- **Colour:** white, black and slate. Colour appears only in the car photographs and in
  the stock status dots (green available, amber reserved, red sold). No gold.
- **Photographs** rest in black and white. A car comes into colour when it has your
  attention: in front of the line-up, under your pointer, or centred on a phone. The
  detail page is always in colour.
- **Soft-UI:** every shape is soft. Pills, 24-28px radii, raised surfaces with a lit top
  lip, pressed wells for inputs. No sharp corners anywhere.
- **Type:** Excon (Fontshare), one family, from 100 to 500. Thin weights carry the large
  names and figures.
- **Signature:** the house name, set once and very large, at the foot of every page.

Plain HTML, CSS and ES modules. No build step. Reuses `../data.js`.

## Run

From `prototype/`:

```bash
bunx serve -p 3008
```

Open http://localhost:3008/mono/

Pages live in folders (`vehicules/`, `vehicule/?id=5`), so the query string survives
any server. The older `showroom/` and `nuit/` prototypes use `vehicule.html?id=`, and
`serve` drops that query when it redirects, so their detail links all open car N° 01.

## Verifications

**Accueil** (`/mono/`)
1. First screen: brand, model in a thin large title, price on the right, the photo in a
   rounded card, a glass readout, and the search dock resting half on the photo.
2. Scroll slowly from the top. The photo card opens to the full width and the car moves
   slightly closer. (Chrome, Edge, Safari 26. Firefox shows the card without the motion.)
3. The dots top-left fill with the time left on each car (7 s). Hover the photo and the
   dot stops. Click a dot to jump. Left and right arrow keys work.
4. Search: pick `Toyota`, then `Rechercher`. The stock page opens with 3 Toyotas.
5. « En stock au showroom »: the section pins, and scrolling moves the cars sideways. The
   car in front is in colour, the others in black and white. The counter, the rail and
   the name at the bottom follow.
6. The statement below: the words turn from grey to black as you read down.
7. Showroom: the week shows the real hours. Today is raised. The line under it says
   whether the showroom is open now.
8. « Vous ne trouvez pas votre modèle ? »: submit empty for the message, filled for
   WhatsApp.

**Véhicules** (`/mono/vehicules/`)
9. The filter bar follows you down the page. Change a filter: the cards travel to their
   new places, and the count in the title updates (`3/8`).
10. The energy switch has a white thumb that slides between options.
11. Hover a card: its photo comes into colour.
12. The URL follows the filters. Copy it, open it in a new tab, same result.

**Détail** (`/mono/vehicule/?id=5`)
13. Click a card on the stock page. In Chrome and Safari, its photo travels into the
    detail page.
14. The right panel stays in view. Its tabs (Photos, Détails, Description, Visite) follow
    your reading position, with the same sliding thumb.
15. The photo counter follows the photos. The facts use large, light figures.
16. Visite: only open days and hours. Submit without a slot for the message.
17. `?id=8` (sold): red status, no Visite tab or section, action « Être prévenu ».

**Phone width**
18. Hero: the readout moves under the photo, so the car stays whole. The dock follows.
19. The line-up is a swipe row. The card in the middle is in colour.
20. Détail: swipe the photos. Scroll past the price, and a glass bar brings it back with
    « Réserver une visite ».

**Reduced motion**
21. No autoplay, no card travel, no scroll motion. The line-up becomes a sideways row.
    The statement is fully black.

## Honest gaps

- **Black and white is a bet.** It unifies uneven stock photos and suits the palette,
  but a buyer must see the paint. The colour always arrives on focus and on the detail
  page. Say if you want colour everywhere instead.
- **Photo colour versus data.** In colour, the Jaguar photo is blue while the record
  says « Gris Eiger ». The photos are stand-ins from Wikimedia.
- **One photo per car**, so the detail gallery shows 3 framings of the same photo.
- **Phone numbers are placeholders.** « Le showroom vous recontacte » is a promise the
  staff must keep.
- **The brand change:** `PRODUCT.md` still says « gold-on-dark accent is a commitment ».
  This direction drops gold, as you asked. Update `PRODUCT.md` if it holds.
