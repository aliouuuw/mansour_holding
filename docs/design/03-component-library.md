# Mansour Holding — Component Library

> Inventory of all UI components, their variants, states, and usage guidelines.
> Aesthetic axis: **Luxury / Refined** — sharp, authoritative, black + gold + silver.

---

## 1. Component Architecture

```
src/components/
├── ui/                    # Atomic, reusable primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Table.tsx
│   ├── Modal.tsx
│   ├── Dropdown.tsx
│   ├── Toast.tsx
│   ├── Skeleton.tsx
│   ├── Avatar.tsx
│   ├── Tabs.tsx
│   ├── EmptyState.tsx
│   ├── StatusDot.tsx
│   ├── Separator.tsx
│   └── Tooltip.tsx
├── layout/                # Page structure
│   ├── DashboardLayout.tsx
│   ├── PublicLayout.tsx
│   ├── AuthLayout.tsx
│   └── PageHeader.tsx
├── shared/                # Composed, cross-feature
│   ├── KPICard.tsx
│   ├── DataTable.tsx
│   ├── SearchInput.tsx
│   ├── FilterBar.tsx
│   ├── StatCard.tsx
│   └── ConfirmDialog.tsx
└── features/              # Domain-specific (in feature folders)
    └── motors/
        ├── VehicleCard.tsx
        ├── DealCard.tsx
        └── CustomerRow.tsx
```

---

## 2. Button

The most important interactive element. Must feel decisive and premium.

### Variants

| Variant       | Background           | Text            | Border              | Usage                          |
|---------------|----------------------|-----------------|---------------------|--------------------------------|
| **Primary**   | `noir-950`           | `white`         | None                | Main actions: "Ajouter", "Confirmer" |
| **Gold**      | `gold-400`           | `noir-950`      | None                | Premium CTAs: "Créer une affaire" |
| **Secondary** | `transparent`        | `noir-900`      | `border-border`     | Secondary actions: "Annuler", "Filtres" |
| **Ghost**     | `transparent`        | `noir-600`      | None                | Tertiary: "Voir tout", inline actions |
| **Danger**    | `transparent`        | `danger-500`    | `border-danger-500` | Destructive: "Supprimer"       |

### Sizes

| Size    | Height | Padding        | Font Size | Usage                          |
|---------|--------|----------------|-----------|--------------------------------|
| `sm`    | 32px   | `px-3 py-1.5`  | 12px      | Table actions, inline          |
| `md`    | 38px   | `px-4 py-2`    | 13px      | **Default** — most buttons     |
| `lg`    | 44px   | `px-5 py-2.5`  | 14px      | Page-level CTAs, hero buttons  |
| `xl`    | 52px   | `px-8 py-3`    | 15px      | Landing page hero CTAs         |

### States

| State        | Treatment                                          |
|--------------|----------------------------------------------------|
| **Default**  | As defined per variant                             |
| **Hover**    | Slight lightening (`noir-800` for primary), `shadow-sm` |
| **Active**   | Slight darkening, `scale-[0.98]` (2% press)       |
| **Disabled** | `opacity-40`, `cursor-not-allowed`                 |
| **Loading**  | Content replaced with subtle spinner, same dimensions |

### Rules
- Always include `transition-all duration-200`
- Icon + text: icon left, 8px gap (`gap-2`)
- Icon-only buttons: square, same height as width
- **Never** use gradient backgrounds
- **Never** use `rounded-full` on buttons (not a pill)
- Border radius: `rounded` (4px)

### Code Pattern

```tsx
interface ButtonProps {
  variant?: 'primary' | 'gold' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  children: React.ReactNode
}
```

---

## 3. Input / Textarea / Select

Form controls must feel precise and high-quality.

### Default Style
- Background: `white`
- Border: `border border-border` (1px, warm gray)
- Border radius: `rounded` (4px)
- Padding: `px-4 py-2.5`
- Font size: 14px (`text-sm`)
- Placeholder: `noir-400` (muted)
- Text: `noir-950`

### States

| State        | Treatment                                          |
|--------------|----------------------------------------------------|
| **Default**  | `border-border`, white background                  |
| **Hover**    | `border-border-strong`                             |
| **Focus**    | `border-gold-400`, `ring-2 ring-gold-100`          |
| **Error**    | `border-danger-500`, `ring-2 ring-danger-50`       |
| **Disabled** | `bg-noir-50`, `opacity-60`, `cursor-not-allowed`   |

### Label Style
- Font: 13px, `font-medium`, `noir-900`
- Spacing: `mb-1.5` below label
- Required indicator: gold dot, not red asterisk

### Rules
- **Gold focus ring** — the signature interaction
- Never use blue focus rings
- Error messages: `text-danger-500`, 12px, `mt-1.5`
- Help text: `text-noir-400`, 12px, `mt-1.5`

---

## 4. Card

The primary container for content grouping.

### Variants

| Variant       | Background  | Border           | Shadow      | Usage                    |
|---------------|-------------|------------------|-------------|--------------------------|
| **Default**   | `surface`   | `border-border`  | `shadow-xs` | Standard content cards   |
| **Elevated**  | `surface`   | None             | `shadow-md` | Featured/highlighted     |
| **Dark**      | `noir-900`  | `border-white/8` | None        | Premium sections, CTAs   |
| **Ghost**     | Transparent | `border-border`  | None        | Subtle grouping          |

### Anatomy
```
┌─────────────────────────────────┐
│  Header (optional)              │  ← border-b border-border, px-6 py-4
├─────────────────────────────────┤
│                                 │
│  Body                           │  ← p-6
│                                 │
├─────────────────────────────────┤
│  Footer (optional)              │  ← border-t border-border, px-6 py-4
└─────────────────────────────────┘
```

### Rules
- Border radius: `rounded-md` (6px)
- Padding: `p-6` standard, `p-8` for featured
- Hover (if clickable): `hover:shadow-md hover:-translate-y-px`
- **Never** use `rounded-2xl` — too soft
- Card headers use `font-semibold text-noir-950`, 15px

---

## 5. Badge / Status Indicator

For status labels, counts, and categorical tags.

### Variants

| Variant       | Background       | Text            | Usage                          |
|---------------|------------------|-----------------|--------------------------------|
| **Success**   | `success-50`     | `success-600`   | Disponible, Conclu             |
| **Warning**   | `warning-50`     | `warning-600`   | Réservé, Négociation           |
| **Danger**    | `danger-50`      | `danger-600`    | Perdu, Erreur                  |
| **Info**      | `info-50`        | `info-600`      | Prospect, Nouveau              |
| **Neutral**   | `noir-100`       | `noir-600`      | Default, Vendu                 |
| **Gold**      | `gold-50`        | `gold-700`      | Premium, VIP, Featured         |

### Style
- Border radius: `rounded` (4px) — **not pill-shaped**
- Padding: `px-2.5 py-1`
- Font: 11px, `font-medium`, `uppercase tracking-wide`
- No border — background + text only

### Status Dot (Minimal Alternative)
- 8px circle (`h-2 w-2 rounded-full`)
- Used inline with text for compact status display
- Colors match badge semantic colors

---

## 6. Table (DataTable)

Data-dense, scannable, professional. The workhorse of the dashboard.

### Structure
```
┌──────────────────────────────────────────────┐
│  Table Header Row                            │  ← bg-noir-50, uppercase, 11px
├──────────────────────────────────────────────┤
│  Row 1                                       │  ← hover:bg-noir-50/50
├──────────────────────────────────────────────┤
│  Row 2                                       │
├──────────────────────────────────────────────┤
│  Row 3                                       │
└──────────────────────────────────────────────┘
```

### Header Cell Style
- Background: `noir-50` (subtle warm gray)
- Text: `noir-500`, 11px, `font-semibold`, `uppercase`, `tracking-wider`
- Padding: `px-5 py-3`
- No bold — the uppercase + tracking provides hierarchy

### Body Cell Style
- Text: `noir-900`, 13px
- Padding: `px-5 py-4` (generous — luxury spacing)
- Muted secondary text: `noir-400`, 12px

### Row Interactions
- Hover: `bg-noir-50/50` (barely visible warm tint)
- Selected: `bg-gold-50`, `border-l-2 border-gold-400`
- Dividers: `divide-y divide-border`

### Rules
- Container: `rounded-md border border-border bg-white shadow-xs`
- **Generous cell padding** — never cramped
- Numeric columns: right-aligned, `tabular-nums font-medium`
- Action column: right-aligned, ghost buttons only
- Empty state: centered, 80px vertical padding, muted text + gold CTA

---

## 7. Modal / Dialog

Focused, centered, authoritative.

### Structure
```
┌─ Backdrop (noir-950/60) ──────────────────┐
│                                            │
│   ┌─ Modal ─────────────────────────┐      │
│   │  Header: Title + Close          │      │  ← border-b, px-6 py-5
│   ├─────────────────────────────────┤      │
│   │                                 │      │
│   │  Body                           │      │  ← p-6
│   │                                 │      │
│   ├─────────────────────────────────┤      │
│   │  Footer: Actions                │      │  ← border-t, px-6 py-4, flex justify-end
│   └─────────────────────────────────┘      │
│                                            │
└────────────────────────────────────────────┘
```

### Style
- Background: `surface`
- Border radius: `rounded-lg` (8px)
- Shadow: `shadow-lg`
- Backdrop: `bg-noir-950/60` with `backdrop-blur-sm`
- Title: 18px, `font-semibold`, `noir-950`
- Close button: `X` icon, ghost style, top-right

### Animation
- Enter: `scale-95 opacity-0` → `scale-100 opacity-100`, 200ms
- Exit: `scale-100 opacity-100` → `scale-95 opacity-0`, 150ms

### Footer Actions
- Primary action: right-most, `primary` or `gold` button
- Cancel: left of primary, `ghost` button
- Destructive: `danger` variant, left-aligned

---

## 8. Toast / Notification

Minimal, informative, non-intrusive.

### Position
- Top-right corner, 16px from edges
- Stack vertically with 8px gap

### Variants

| Variant     | Left Accent        | Icon              |
|-------------|--------------------|--------------------|
| **Success** | `border-l-2 border-success-500` | `Check` |
| **Error**   | `border-l-2 border-danger-500`  | `X`     |
| **Warning** | `border-l-2 border-warning-500` | `AlertTriangle` |
| **Info**    | `border-l-2 border-info-500`    | `Info`  |

### Style
- Background: `surface`
- Border: `border border-border` + left accent
- Shadow: `shadow-lg`
- Border radius: `rounded` (4px)
- Padding: `px-4 py-3`
- Text: 13px, `noir-900`
- Auto-dismiss: 4 seconds
- **No emoji, no exclamation marks**

---

## 9. Avatar

For user profiles and initials.

### Sizes

| Size   | Dimensions | Font Size | Usage                    |
|--------|------------|-----------|--------------------------|
| `xs`   | 24px       | 10px      | Inline mentions          |
| `sm`   | 32px       | 12px      | Table rows, compact      |
| `md`   | 40px       | 14px      | **Default** — sidebar, header |
| `lg`   | 56px       | 18px      | Profile pages            |

### Style
- Shape: `rounded-full` (only component that uses full rounding)
- Background: `noir-800` (dark, premium)
- Text: `gold-300` (gold initials on dark)
- Border: `ring-2 ring-noir-700` (subtle definition)
- Image avatars: `object-cover`, same rounding

---

## 10. Skeleton / Loading

Premium loading states — no spinners.

### Style
- Background: `noir-100` (light) or `noir-800` (dark)
- Animation: Subtle shimmer sweep, left to right, 1.5s loop
- Shape: Matches the element being loaded (text = narrow rect, image = full rect)
- Border radius: Matches target element

### Shimmer Keyframes
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-noir-100) 25%,
    var(--color-noir-50) 50%,
    var(--color-noir-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

---

## 11. Empty State

When there's no data to show.

### Structure
```
┌─────────────────────────────────┐
│                                 │
│         [Icon — noir-300]       │
│                                 │
│    "Aucun véhicule"             │  ← noir-950, font-semibold, 15px
│    "Ajoutez votre premier       │  ← noir-400, 13px
│     véhicule à l'inventaire"    │
│                                 │
│    [ Ajouter un véhicule ]      │  ← gold button
│                                 │
└─────────────────────────────────┘
```

### Rules
- Centered vertically and horizontally
- Icon: 40px, `noir-300`, relevant to context
- Title: direct, states what's missing
- Description: one line, explains what to do
- CTA: `gold` variant button
- **No illustrations** — icons only
- Vertical padding: `py-16` minimum

---

## 12. Tabs

For switching between views within a page.

### Style
- Container: `border-b border-border`
- Tab item: `px-4 py-3`, 13px, `font-medium`
- Inactive: `noir-400`, no background
- Active: `noir-950`, `border-b-2 border-gold-400` (gold underline)
- Hover: `noir-600`

### Rules
- Gold underline is the active indicator — signature interaction
- Never use pill-shaped tabs
- Never use background-colored tabs
- Tab content area: `pt-6` below tabs

---

## 13. Dropdown / Select Menu

### Style
- Trigger: Same as `secondary` button or input
- Menu: `bg-surface`, `border border-border`, `shadow-lg`, `rounded-md`
- Item: `px-4 py-2.5`, 13px
- Item hover: `bg-noir-50`
- Item active/selected: `bg-gold-50`, `text-noir-950`, gold dot left
- Separator: `border-t border-border`, `my-1`

---

## 14. KPI Card (Composed)

The signature dashboard element.

### Structure
```
┌─────────────────────────────────┐
│  Label          [Icon]          │  ← noir-400, 12px uppercase tracking
│                                 │
│  178 500 000 F CFA              │  ← noir-950, 24px, font-extrabold
│  +12,5% vs mois dernier        │  ← success-500 or danger-500, 12px
└─────────────────────────────────┘
```

### Style
- Container: `rounded-md border border-border bg-white p-6 shadow-xs`
- Label: 12px, `uppercase tracking-wider font-medium text-noir-400`
- Value: 24px, `font-extrabold text-noir-950 tabular-nums`
- Change indicator: 12px, `font-medium`, color-coded (jade/garnet)
- Icon: 18px, `noir-300` — **no colored background circle**

### Rules
- Icon is decorative context, not a colored badge
- Numbers always use `tabular-nums` for alignment
- Change uses `↑` / `↓` arrows, not emoji
- Grid: `grid-cols-4` on desktop, `grid-cols-2` on tablet, `grid-cols-1` on mobile

---

## 15. Component Naming Conventions

| Pattern              | Example                    |
|----------------------|----------------------------|
| **UI primitives**    | `Button`, `Input`, `Badge` |
| **Composed shared**  | `KPICard`, `DataTable`     |
| **Feature-specific** | `VehicleCard`, `DealCard`  |
| **Layout**           | `DashboardLayout`, `PageHeader` |

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: Co-located in component file or `types.ts`
- One component per file (max)
