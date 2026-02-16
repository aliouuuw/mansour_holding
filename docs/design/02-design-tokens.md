# Mansour Holding — Design Tokens

> Atomic values that power the entire UI. Maps directly to TailwindCSS 4 `@theme` configuration.
> All tokens reflect the **luxury / refined** aesthetic: black + gold + silver.

---

## 1. Color Tokens

Defined in `apps/web/src/index.css` under `@theme`.

### Target Implementation

```css
@theme {
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;

  /* ── Noir (Core Neutrals) ── */
  --color-noir-950: #0A0A0A;
  --color-noir-900: #141414;
  --color-noir-800: #1F1F1F;
  --color-noir-700: #2E2E2E;
  --color-noir-600: #404040;
  --color-noir-500: #525252;
  --color-noir-400: #737373;
  --color-noir-300: #A3A3A3;
  --color-noir-200: #D4D4D4;
  --color-noir-100: #E8E8E8;
  --color-noir-50:  #F5F5F5;

  /* ── Gold (Signature Accent) ── */
  --color-gold-50:  #FBF7EC;
  --color-gold-100: #F5ECCE;
  --color-gold-200: #E8D48B;
  --color-gold-300: #D4B94E;
  --color-gold-400: #C8A84E;
  --color-gold-500: #B8963A;
  --color-gold-600: #9A7B2C;
  --color-gold-700: #7A6122;

  /* ── Silver (Secondary Accent) ── */
  --color-silver-50:  #FAFAFA;
  --color-silver-100: #F0F0F0;
  --color-silver-200: #D9D9D9;
  --color-silver-300: #ACACAC;
  --color-silver-400: #8A8D8F;
  --color-silver-500: #6B6B6B;

  /* ── Semantic (Desaturated Luxury) ── */
  --color-success-50:  #EDF7F3;
  --color-success-500: #2D8B6F;
  --color-success-600: #237058;
  --color-success-700: #1A5542;

  --color-warning-50:  #FDF6E3;
  --color-warning-500: #B8860B;
  --color-warning-600: #966D09;

  --color-danger-50:  #FDF0F0;
  --color-danger-500: #A63D40;
  --color-danger-600: #8B3234;

  --color-info-50:  #EEF2F7;
  --color-info-500: #4A6FA5;
  --color-info-600: #3D5C8A;

  /* ── Surfaces ── */
  --color-surface:        #FFFFFF;
  --color-surface-dim:    #F9F9F7;
  --color-surface-bright: #F0F0EC;
  --color-surface-dark:   #0A0A0A;

  /* ── Borders ── */
  --color-border:        #E5E5E0;
  --color-border-strong: #C8C8C3;

  /* ── Text shortcuts ── */
  --color-muted: #737373;

  /* ── Overlay ── */
  --color-overlay: rgba(0, 0, 0, 0.6);
}
```

### Migration from Current (Blue) to Target (Noir+Gold)

| Old Token          | New Token          | Notes                          |
|--------------------|--------------------|--------------------------------|
| `primary-950`      | `noir-950`         | Sidebar, hero backgrounds      |
| `primary-900`      | `noir-900`         | Dark surfaces                  |
| `primary-600`      | `gold-400`         | CTAs, active states, links     |
| `primary-700`      | `gold-500`         | CTA hover                      |
| `primary-300`      | `gold-300`         | Accent text on dark            |
| `primary-400`      | `gold-300`         | Icons on dark                  |
| `primary-100`      | `gold-100`         | Focus rings                    |
| `primary-50`       | `gold-50`          | Selected backgrounds           |
| `accent-*`         | Removed            | Gold replaces violet           |
| `surface-dim`      | `surface-dim`      | Warmer: `#F9F9F7`             |
| `surface-bright`   | `surface-bright`   | Warmer: `#F0F0EC`             |
| `border`           | `border`           | Warmer: `#E5E5E0`             |
| `muted`            | `muted`            | Now `#737373` (noir-400)       |

---

## 2. Spacing Scale

Based on a 4px base unit. Luxury = generous spacing. Never cramped.

| Token  | Value  | Tailwind Class | Usage                                    |
|--------|--------|----------------|------------------------------------------|
| `0.5`  | 2px    | `p-0.5`        | Tight inline spacing                     |
| `1`    | 4px    | `p-1`          | Icon padding, tight gaps                 |
| `1.5`  | 6px    | `p-1.5`        | Small button padding                     |
| `2`    | 8px    | `p-2`          | Icon buttons, compact elements           |
| `2.5`  | 10px   | `p-2.5`        | Input padding (vertical)                 |
| `3`    | 12px   | `p-3`          | Nav items, compact card padding          |
| `4`    | 16px   | `p-4`          | Page padding (mobile), standard gap      |
| `5`    | 20px   | `p-5`          | KPI card padding                         |
| `6`    | 24px   | `p-6`          | Card padding (comfortable)               |
| `8`    | 32px   | `p-8`          | Page padding (desktop), major sections   |
| `10`   | 40px   | `p-10`         | Hero inner padding                       |
| `12`   | 48px   | `p-12`         | Auth panel padding, footer               |
| `16`   | 64px   | `p-16`         | CTA section padding                      |
| `20`   | 80px   | `p-20`         | Landing section padding                  |
| `24`   | 96px   | `p-24`         | Hero section padding (desktop)           |
| `32`   | 128px  | `p-32`         | Extra-generous landing sections          |

### Spacing Conventions

| Context                | Horizontal         | Vertical           |
|------------------------|--------------------|--------------------|
| **Page (mobile)**      | `px-5` (20px)      | `py-5` (20px)      |
| **Page (desktop)**     | `px-10` (40px)     | `py-10` (40px)     |
| **Card inner**         | `p-6` standard     | `p-8` for hero cards|
| **Form field gap**     | —                  | `space-y-6`        |
| **Section gap**        | —                  | `space-y-10`       |
| **Grid gap**           | `gap-5` or `gap-6` | —                  |
| **Nav item padding**   | `px-4 py-3`        | —                  |

> **Note**: Luxury spacing is 20-30% more generous than typical SaaS. This is intentional.

---

## 3. Border Radius

Luxury = sharper. Not everything is a pillow.

| Token    | Value  | Tailwind Class  | Usage                                    |
|----------|--------|-----------------|------------------------------------------|
| `none`   | 0px    | `rounded-none`  | Hero images, full-bleed sections         |
| `sm`     | 2px    | `rounded-sm`    | Subtle rounding on small elements        |
| `md`     | 4px    | `rounded`       | **Default** — buttons, inputs, badges    |
| `lg`     | 6px    | `rounded-md`    | Cards, modals, dropdowns                 |
| `xl`     | 8px    | `rounded-lg`    | Feature cards, image containers          |
| `full`   | 9999px | `rounded-full`  | Avatars, status dots only                |

### Radius Conventions

| Component          | Radius           | Notes                          |
|--------------------|------------------|--------------------------------|
| **Buttons**        | `rounded`  (4px) | Sharp, authoritative           |
| **Inputs**         | `rounded`  (4px) | Matches buttons               |
| **Cards**          | `rounded-md` (6px) | Subtle, not bubbly          |
| **Modals**         | `rounded-lg` (8px) | Slightly softer for overlay |
| **Avatars**        | `rounded-full`   | Only exception to sharp rule   |
| **Status badges**  | `rounded` (4px)  | Not pill-shaped — rectangular  |
| **Landing cards**  | `rounded-lg` (8px) | Max radius in the system    |
| **Images in cards**| `rounded` (4px)  | Subtle                         |
| **Sidebar items**  | `rounded` (4px)  | Tight, precise                 |
| **Hero images**    | `rounded-none`   | Full-bleed, no rounding        |

> **Key change**: Moving from `rounded-xl` (12px) everywhere to `rounded` / `rounded-md` (4-6px). Luxury is precise, not soft.

---

## 4. Shadows

Luxury shadows are subtle and warm-toned, never harsh blue-gray.

| Token          | Value                                                              | Usage                        |
|----------------|--------------------------------------------------------------------|------------------------------|
| `shadow-xs`    | `0 1px 2px 0 rgba(10, 10, 10, 0.04)`                              | Resting cards, inputs        |
| `shadow-sm`    | `0 2px 4px 0 rgba(10, 10, 10, 0.06)`                              | Buttons, elevated elements   |
| `shadow-md`    | `0 4px 12px -2px rgba(10, 10, 10, 0.08)`                          | Hover-elevated cards         |
| `shadow-lg`    | `0 8px 24px -4px rgba(10, 10, 10, 0.12)`                          | Modals, dropdowns            |
| `shadow-xl`    | `0 16px 48px -8px rgba(10, 10, 10, 0.16)`                         | Hero CTAs, featured elements |
| `shadow-gold`  | `0 0 0 1px rgba(200, 168, 78, 0.3), 0 2px 8px rgba(200, 168, 78, 0.1)` | Gold-accented focus rings |

### Shadow Conventions

| State              | Shadow         |
|--------------------|----------------|
| **Card resting**   | `shadow-xs`    |
| **Card hover**     | `shadow-md`    |
| **Modal**          | `shadow-lg`    |
| **Dropdown**       | `shadow-lg`    |
| **Button resting** | None or `shadow-xs` |
| **Button hover**   | `shadow-sm`    |
| **Gold focus**     | `shadow-gold`  |

> **Note**: Shadows use pure black (`#0A0A0A`) base, not blue-gray. This keeps them warm and luxurious.

---

## 5. Breakpoints

Standard Tailwind breakpoints, used consistently:

| Prefix | Min Width | Usage                                          |
|--------|-----------|------------------------------------------------|
| (none) | 0px       | Mobile-first base styles                       |
| `sm`   | 640px     | 2-column grids, inline form layouts            |
| `md`   | 768px     | Tablet adjustments                             |
| `lg`   | 1024px    | Desktop — sidebar visible, 4-col grids         |
| `xl`   | 1280px    | Wide desktop — max-width containers            |
| `2xl`  | 1536px    | Ultra-wide (rarely needed)                     |

### Responsive Strategy

| Layout Element      | Mobile            | Desktop (`lg:`)        |
|---------------------|-------------------|------------------------|
| **Sidebar**         | Hidden (overlay)  | Fixed left, 260px      |
| **Content area**    | Full width        | `lg:pl-[260px]`        |
| **Page padding**    | `p-5`             | `lg:p-10`              |
| **KPI grid**        | 1 col → `sm:2`   | `lg:grid-cols-4`       |
| **Business cards**  | 1 col             | `sm:grid-cols-2`       |
| **Vehicle grid**    | 1 col → `sm:2`   | `lg:grid-cols-3`       |
| **Landing max-w**   | Full              | `max-w-7xl` centered   |

---

## 6. Z-Index Scale

| Token  | Value | Usage                                          |
|--------|-------|------------------------------------------------|
| `z-0`  | 0     | Default stacking                               |
| `z-10` | 10    | Sticky table headers                           |
| `z-20` | 20    | Floating action buttons                        |
| `z-30` | 30    | Dashboard header (sticky)                      |
| `z-40` | 40    | Mobile sidebar overlay backdrop                |
| `z-50` | 50    | Sidebar, modals, landing header, dropdowns     |

---

## 7. Transitions & Animation

Luxury motion = deliberate, smooth, never bouncy.

| Property               | Duration | Easing                    | Usage                          |
|------------------------|----------|---------------------------|--------------------------------|
| `transition-colors`    | 200ms    | `ease-out`                | Background, text, border color |
| `transition-shadow`    | 200ms    | `ease-out`                | Card hover elevation           |
| `transition-transform` | 200ms    | `ease-out`                | Card lift on hover             |
| `transition-opacity`   | 200ms    | `ease-out`                | Fade in/out                    |
| `transition-all`       | 200ms    | `ease-out`                | Complex state changes          |
| Sidebar slide          | 250ms    | `cubic-bezier(.4,0,.2,1)` | Sidebar open/close            |
| Image reveal           | 400ms    | `ease-out`                | Image zoom on hover            |
| Modal enter            | 200ms    | `cubic-bezier(.4,0,.2,1)` | Scale + fade in               |
| Modal exit             | 150ms    | `ease-in`                 | Scale + fade out               |

### Motion Conventions

- **Hover lift**: `hover:-translate-y-px` (subtle, 1px — not 2px)
- **Hover shadow**: `hover:shadow-md` (gentle elevation)
- **Image zoom**: `group-hover:scale-[1.03]` (3% — subtle, not 5%)
- **Sidebar slide**: `transition-transform duration-250`
- **Gold shimmer**: CSS `@keyframes` for skeleton loading on dark surfaces
- **No bounce**: Never use spring/bounce easing — it's playful, not luxurious
- **Respect `prefers-reduced-motion`**: Disable transforms, keep opacity

---

## 8. Container Widths

| Context              | Max Width        | Tailwind Class       |
|----------------------|------------------|----------------------|
| **Landing page**     | 1280px           | `max-w-7xl`          |
| **Auth form**        | 420px            | `max-w-[420px]`      |
| **Search bar**       | 640px            | `max-w-2xl`          |
| **Dashboard**        | No max (fluid)   | —                    |
| **Modal (small)**    | 420px            | `max-w-[420px]`      |
| **Modal (medium)**   | 640px            | `max-w-2xl`          |
| **Modal (large)**    | 860px            | `max-w-4xl`          |

---

## 9. Border Styles

Luxury borders are thin, warm, and deliberate.

| Style                | Value                          | Usage                          |
|----------------------|--------------------------------|--------------------------------|
| **Default border**   | `1px solid var(--color-border)` | Cards, dividers, inputs       |
| **Strong border**    | `1px solid var(--color-border-strong)` | Active states, emphasis |
| **Gold border**      | `1px solid var(--color-gold-400)` | Selected items, premium indicators |
| **Dark divider**     | `1px solid rgba(255,255,255,0.08)` | Sidebar dividers, dark surfaces |
| **No border + shadow** | `shadow-xs` only             | Alternative card style         |

### Border Conventions
- Cards: `border border-border` (warm gray, 1px)
- On dark surfaces: `border-white/[0.08]` (barely visible)
- Active/selected: `border-gold-400` (gold highlight)
- Never use `border-2` — too heavy for luxury
- Dividers inside cards: `divide-y divide-border` (consistent)
