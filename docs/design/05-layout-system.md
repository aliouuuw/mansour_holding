# Mansour Holding — Layout System

> Page structures, grid systems, responsive behavior, and spatial rules.
> Luxury spacing: generous, deliberate, never cramped.

---

## 1. Layout Archetypes

The platform uses 4 distinct layout archetypes:

| Archetype          | Used For                              | Sidebar | Header | Max Width |
|--------------------|---------------------------------------|---------|--------|-----------|
| **Dashboard**      | All authenticated dashboard pages     | Yes     | Yes    | Fluid     |
| **Public**         | Landing, vehicle catalog, detail      | No      | Yes    | 1280px    |
| **Auth**           | Login, register, forgot password      | No      | No     | 420px     |
| **Fullscreen**     | Print views, PDF preview (future)     | No      | No     | Fluid     |

---

## 2. Dashboard Layout

The primary layout for all authenticated users.

### Structure

```
┌──────────────────────────────────────────────────────────────┐
│ Sidebar (260px)  │  Header (64px, sticky)                    │
│ noir-950         │  surface bg, border-b border-border       │
│ fixed            │                                           │
│                  ├───────────────────────────────────────────┤
│                  │                                           │
│                  │  Content Area                             │
│                  │  surface-dim bg                           │
│                  │  p-6 lg:p-10                              │
│                  │                                           │
│                  │                                           │
│                  │                                           │
└──────────────────┴───────────────────────────────────────────┘
```

### Sidebar Specifications

| Property          | Value                                    |
|-------------------|------------------------------------------|
| **Width**         | 260px                                    |
| **Background**    | `noir-950` (#0A0A0A)                     |
| **Position**      | Fixed left, full height                  |
| **Mobile**        | Hidden, slides in as overlay             |
| **Transition**    | `transform 250ms cubic-bezier(.4,0,.2,1)` |
| **Dividers**      | `border-white/[0.08]`                    |
| **Scroll**        | `overflow-y-auto` with hidden scrollbar  |

### Sidebar Sections (Top to Bottom)

1. **Brand bar** (h-16): Gold icon + "MANSOUR HOLDING" + subtitle
2. **Business switcher** (h-14): Dropdown button, noir-800 bg
3. **Navigation** (flex-1): Nav items with section headers
4. **User bar** (h-16): Avatar + name + role + logout

### Header Specifications

| Property          | Value                                    |
|-------------------|------------------------------------------|
| **Height**        | 64px                                     |
| **Background**    | `surface` (#FFFFFF)                      |
| **Position**      | Sticky top, z-30                         |
| **Border**        | `border-b border-border`                 |
| **Left content**  | Breadcrumb or page context (desktop)     |
| **Right content** | Notifications bell + user avatar         |
| **Mobile**        | Hamburger menu button (left)             |

### Content Area

| Property          | Value                                    |
|-------------------|------------------------------------------|
| **Background**    | `surface-dim` (#F9F9F7)                  |
| **Padding**       | `p-6` mobile, `lg:p-10` desktop          |
| **Offset**        | `lg:pl-[260px]` (sidebar width)          |
| **Min height**    | `min-h-screen`                           |

---

## 3. Public Layout

For all unauthenticated public-facing pages.

### Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Header (64px, sticky)                                       │
│  noir-950 bg, max-w-7xl inner                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Content (varies)                                            │
│  max-w-7xl centered                                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  Footer                                                      │
│  noir-950 bg, max-w-7xl inner                                │
└──────────────────────────────────────────────────────────────┘
```

### Public Header

| Property          | Value                                    |
|-------------------|------------------------------------------|
| **Height**        | 64px                                     |
| **Background**    | `noir-950` (black, not white)            |
| **Position**      | Sticky top, z-50                         |
| **Inner max-w**   | `max-w-7xl` centered                     |
| **Logo**          | Gold icon + white wordmark               |
| **Nav links**     | `silver-300`, hover `white`              |
| **CTA**           | Gold button ("Espace pro" or "Dashboard")|

### Public Footer

| Property          | Value                                    |
|-------------------|------------------------------------------|
| **Background**    | `noir-950`                               |
| **Text**          | `silver-400` (links), `silver-500` (copyright) |
| **Inner max-w**   | `max-w-7xl` centered                     |
| **Padding**       | `py-16`                                  |
| **Grid**          | 4 columns on desktop, stacked on mobile  |

---

## 4. Auth Layout

Full-screen dark canvas with centered form.

### Structure

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                        noir-950 full bg                      │
│                                                              │
│              ▪ MANSOUR HOLDING                               │
│                                                              │
│         ┌────────────────────────────┐                       │
│         │  Form card                 │                       │
│         │  max-w-[420px]             │                       │
│         │  bg-transparent or         │                       │
│         │  bg-noir-900 with border   │                       │
│         └────────────────────────────┘                       │
│                                                              │
│              © 2026 Mansour Holding                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Auth Form Inputs (Dark Variant)

| Property          | Value                                    |
|-------------------|------------------------------------------|
| **Background**    | `noir-800`                               |
| **Border**        | `border-noir-700`                        |
| **Text**          | `white`                                  |
| **Placeholder**   | `noir-500`                               |
| **Focus border**  | `gold-400`                               |
| **Focus ring**    | `ring-2 ring-gold-400/20`                |
| **Label**         | `silver-300`, 13px, font-medium          |

---

## 5. Grid System

### Page-Level Grids

| Grid Pattern         | Columns                    | Gap    | Usage                          |
|----------------------|----------------------------|--------|--------------------------------|
| **KPI row**          | `grid-cols-1 sm:2 lg:4`   | `gap-5` | Dashboard KPI cards           |
| **Business cards**   | `grid-cols-1 sm:2`        | `gap-5` | Holding overview              |
| **Vehicle catalog**  | `grid-cols-1 sm:2 lg:3`   | `gap-6` | Public vehicle grid           |
| **Detail 3+2**       | `grid-cols-1 lg:grid-cols-5` | `gap-8` | Vehicle detail (3 left, 2 right) |
| **Kanban**           | `flex` horizontal scroll   | `gap-5` | Sales pipeline columns        |
| **Landing cards**    | `grid-cols-1 sm:2 lg:3`   | `gap-6` | Business showcase             |

### Content-Level Grids

| Grid Pattern         | Columns                    | Gap    | Usage                          |
|----------------------|----------------------------|--------|--------------------------------|
| **Form 2-col**       | `grid-cols-1 sm:2`        | `gap-4` | Name fields, compact forms    |
| **Spec grid**        | `grid-cols-1 sm:2`        | `gap-4` | Vehicle specifications        |
| **Stats inline**     | `grid-cols-3`             | `gap-4` | Business card stats           |
| **Footer**           | `grid-cols-1 sm:2 lg:4`   | `gap-8` | Footer columns                |

---

## 6. Page Content Patterns

### Pattern A: List Page (Inventory, Customers)

```
┌──────────────────────────────────────┐
│  Page Title              [Action CTA] │  ← PageHeader component
│  Subtitle / count                     │
├──────────────────────────────────────┤
│  Search + Filters                     │  ← FilterBar component
├──────────────────────────────────────┤
│  Data Table                           │  ← DataTable component
│  (full width, rounded-md border)      │
└──────────────────────────────────────┘
```

Spacing: `space-y-6` between sections.

### Pattern B: Dashboard Page (Motors Dashboard, Holding Overview)

```
┌──────────────────────────────────────┐
│  Page Title              [Action CTAs]│
│  Subtitle                             │
├──────────────────────────────────────┤
│  KPI Grid (4 columns)                │
├──────────────────────────────────────┤
│  Content Grid (3+2 or 2+1)          │
│  ┌─────────────────┐ ┌─────────────┐│
│  │ Primary content  │ │ Secondary   ││
│  │ (activity, etc)  │ │ (pipeline)  ││
│  └─────────────────┘ └─────────────┘│
└──────────────────────────────────────┘
```

Spacing: `space-y-8` between major sections.

### Pattern C: Detail Page (Vehicle Detail)

```
┌──────────────────────────────────────┐
│  ← Back    Title    [Status] [Edit]  │
├──────────────────────────────────────┤
│  ┌──────────────────┐ ┌────────────┐│
│  │ Image / Gallery   │ │ Price      ││
│  │                   │ │ Specs      ││
│  │ Description       │ │ Actions    ││
│  └──────────────────┘ └────────────┘│
└──────────────────────────────────────┘
```

Grid: `lg:grid-cols-5` with 3 left + 2 right. Gap: `gap-8`.

### Pattern D: Full-Width Feature (Kanban)

```
┌──────────────────────────────────────┐
│  Page Title              [Action CTA] │
│  Subtitle                             │
├──────────────────────────────────────┤
│  Horizontal scroll container          │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Col 1  │ │ Col 2  │ │ Col 3  │   │
│  │        │ │        │ │        │   │
│  └────────┘ └────────┘ └────────┘   │
└──────────────────────────────────────┘
```

Columns: `min-w-[280px] flex-1`. Container: `flex gap-5 overflow-x-auto pb-4`.

---

## 7. Responsive Behavior Summary

| Breakpoint | Sidebar    | Page Padding | Grid Cols | Typography Scale |
|------------|------------|--------------|-----------|------------------|
| < 640px    | Hidden     | `p-5`        | 1         | Body 14px        |
| 640–1023px | Hidden     | `p-6`        | 2         | Body 14px        |
| ≥ 1024px   | Visible    | `p-10`       | 3–4       | Body 14px        |
| ≥ 1280px   | Visible    | `p-10`       | 4         | Body 14px        |

### Mobile-Specific Adjustments
- Sidebar: overlay with dark backdrop (`noir-950/60`)
- Header: hamburger menu replaces breadcrumb
- KPIs: 1 column (stacked)
- Tables: horizontal scroll with `overflow-x-auto`
- Kanban: horizontal scroll (natural on mobile)
- Modals: full-screen on mobile (`rounded-none`, `h-full`)

---

## 8. Spacing Rhythm

Consistent vertical rhythm throughout the application:

| Between                    | Spacing      |
|----------------------------|--------------|
| Page title → first content | `space-y-8`  |
| KPI grid → next section    | `space-y-8`  |
| Filter bar → table         | `space-y-6`  |
| Card header → card body    | `border-b` + `p-6` |
| Form fields                | `space-y-6`  |
| Modal sections             | `space-y-5`  |
| Landing sections           | `py-20 lg:py-24` |

> **Luxury rule**: When in doubt, add more space. Cramped = cheap.
