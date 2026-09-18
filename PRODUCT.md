# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary (public layer):** Affluent buyers in Dakar, Senegal - business owners, executives, and returning diaspora. They browse mostly on mobile (60%+), often on the move and in daylight, and they compare what they see against international brand sites. Their job: find a specific vehicle worth going to see in person, then make contact.

**Secondary:** Mansour Motors staff using the private dashboard (Espace Pro) to manage inventory, customers, and deals. Out of scope for the public redesign but sharing the same database.

## Product Purpose

Mansour Motors is a physical premium car dealership in Dakar. The public layer exists to make a specific vehicle in real stock desirable enough that a buyer contacts the dealership or visits the showroom. Success is a qualified inquiry or a showroom visit, not an online transaction. Nothing is sold or paid for on the site.

## Positioning

A single named house holding a finite, curated stock of individual vehicles that a buyer can go and stand next to in Dakar the same day. The competing channel is informal resale (WhatsApp, classifieds) with no fixed address and no stock record. Mansour Motors has both. What the public layer must earn on this redesign is desire for the machines themselves.

## Operating Context

- Discovery happens on a phone, frequently on mobile data, sometimes in bright sun.
- Interface language is French. Prices are in FCFA.
- Inquiry is by phone, email, or an on-page form. The dealership is on Avenue Cheikh Anta Diop, Dakar. Stated hours: Mon-Fri 8h-18h, Sat 9h-17h.
- Stock turns over: a vehicle can be available, reserved, or sold, and the public layer shows that state.

## Capabilities and Constraints

**Public routes (scope of this redesign):** `/mansour-motors` (landing), `/mansour-motors/vehicules` (catalogue with filters), `/mansour-motors/vehicules/[vehicleId]` (vehicle detail with image gallery and inquiry form).

**Per-vehicle data that actually exists:** make, model, year, mileage, price (FCFA integer), status (available / reserved / sold), fuel type (gasoline / diesel / hybrid / electric), transmission (manual / automatic / cvt), colour, VIN (optional), free-text description, an ordered array of image URLs, and a free-form `extras` key-value map.

**Data that does not exist:** service history, inspection reports, ownership provenance, per-vehicle documents, engine or power figures, customer reviews. Any design that needs these is inventing them.

**Stack constraints:** Next.js 16 App Router, React 19, Tailwind v4 with tokens in `src/app/globals.css`, framer-motion, Lenis smooth scroll, hugeicons-react, Drizzle + Postgres, server-rendered public pages, images served from a Cloudflare R2 bucket. Deployed on Vercel. Package manager is Bun.

## Brand Commitments

- The name and wordmark "Mansour Motors", under the Mansour Holding parent, are fixed.
- The gold-on-dark accent palette is a commitment to keep or refine, not to discard.
- French copy and the factual contact details are fixed.
- Everything else in the current public implementation - typography, layout, composition, motion, section order - is explicitly open for replacement. The user identifies the current implementation as a first e-commerce-style iteration and treats it as an anti-reference.

## Evidence on Hand

- Real inventory records in Postgres with real prices and states.
- Vehicle photographs in the R2 bucket, quality uneven; the bucket can be reset and repopulated.
- No art-directed photography of the actual showroom, team, or Dakar street yet. The user can source high-quality vehicle imagery from the internet for now and may commission a shoot later.
- **Unverified claims currently on the site that must not be reused as fact without confirmation:** "200+ vehicles sold", "10+ years of experience", "98% satisfied customers", "24h guaranteed response", "100+ inspection points", "48h financing response". Treat each as a placeholder on the user's replacement list.

## Product Principles

1. The individual vehicle is the product. Every public surface exists to make one specific car in real stock desirable.
2. Show only what the database can prove. Absent fields are designed around, never invented.
3. The outcome is a human contact, not a checkout. Phone, visit, and form are the real conversions.
4. Mobile in daylight is the primary viewing condition, not the fallback.
5. Stock state is public truth: reserved and sold are shown, not hidden.

## Accessibility & Inclusion

French-language interface. Mobile-first at phone width with no horizontal scroll. Legibility under bright outdoor light is a real requirement, not a preference.
