# Mansour Holding — UX Principles

> Interaction patterns, accessibility standards, motion design, and behavioral guidelines.
> Every interaction must feel **deliberate, confident, and premium**.

---

## 1. Core UX Philosophy

> "The interface should feel like a well-tailored suit — precise, confident, nothing wasted."

### Principles (Ranked by Priority)

1. **Clarity over cleverness** — Every element has one obvious purpose
2. **Authority through restraint** — Less decoration, more structure
3. **Speed of comprehension** — Users understand the screen in < 3 seconds
4. **Progressive disclosure** — Show what matters now, reveal depth on demand
5. **Respect for expertise** — Users are professionals, not beginners

---

## 2. Interaction Patterns

### 2.1 Navigation

| Pattern                | Implementation                                    |
|------------------------|---------------------------------------------------|
| **Primary nav**        | Sidebar (dashboard), top bar (public)             |
| **Active indicator**   | Gold left border + white text (sidebar)           |
| **Breadcrumbs**        | Header area, `noir-400` text, `>` separator       |
| **Back navigation**    | `ArrowLeft` icon button, top-left of page         |
| **Business switching** | Sidebar dropdown, immediate context switch        |

### 2.2 Data Entry

| Pattern                | Implementation                                    |
|------------------------|---------------------------------------------------|
| **Form submission**    | Gold CTA at bottom, right-aligned in modals       |
| **Validation**         | Inline, on blur. Error below field, `danger-500`  |
| **Required fields**    | Gold dot before label (not red asterisk)           |
| **Auto-save**          | For long forms (future), subtle "Enregistré" text |
| **Confirmation**       | Modal for destructive actions only                |

### 2.3 Data Display

| Pattern                | Implementation                                    |
|------------------------|---------------------------------------------------|
| **Tables**             | Default for lists > 5 items                       |
| **Cards**              | For visual items (vehicles) or summary views      |
| **Kanban**             | For pipeline/workflow stages                      |
| **Detail view**        | 3+2 grid (content left, meta right)               |
| **KPI display**        | 4-column grid, overline label + large value       |

### 2.4 Actions

| Pattern                | Implementation                                    |
|------------------------|---------------------------------------------------|
| **Primary action**     | Gold button, top-right of page header             |
| **Secondary actions**  | Secondary button or ghost button                  |
| **Bulk actions**       | Appear in toolbar when items selected (future)    |
| **Destructive**        | Danger button + confirmation modal                |
| **Inline actions**     | Ghost buttons in table rows, right-aligned        |

### 2.5 Feedback

| Pattern                | Implementation                                    |
|------------------------|---------------------------------------------------|
| **Success**            | Toast (top-right), auto-dismiss 4s                |
| **Error**              | Toast (persistent until dismissed) + inline errors|
| **Loading**            | Skeleton screens, never spinners alone            |
| **Empty state**        | Icon + title + description + gold CTA             |
| **Progress**           | Subtle progress bar (gold fill on noir-100 track) |

---

## 3. State Management (Visual)

### 3.1 Loading States

| Component      | Loading Treatment                                  |
|----------------|----------------------------------------------------|
| **Page**       | Full skeleton of expected layout                   |
| **Table**      | 5 skeleton rows matching column structure          |
| **Card**       | Skeleton matching card anatomy                     |
| **Button**     | Spinner replaces text, same dimensions             |
| **Image**      | `noir-100` placeholder with shimmer                |
| **KPI**        | Skeleton for value + label                         |

**Skeleton shimmer**: Left-to-right sweep, 1.5s, `noir-100` → `noir-50` → `noir-100`

### 3.2 Empty States

| Context              | Icon        | Title                      | CTA                    |
|----------------------|-------------|----------------------------|------------------------|
| **No vehicles**      | `Car`       | "Aucun véhicule"           | "Ajouter un véhicule"  |
| **No deals**         | `Handshake` | "Aucune affaire"           | "Créer une affaire"    |
| **No customers**     | `Users`     | "Aucun client"             | "Ajouter un client"    |
| **No results**       | `Search`    | "Aucun résultat"           | "Modifier les filtres"  |
| **No activity**      | `Clock`     | "Aucune activité récente"  | None                   |

Rules:
- Icon: 40px, `noir-300`
- Title: 15px, `font-semibold`, `noir-950`
- Description: 13px, `noir-400`, one line
- CTA: `gold` variant button
- Padding: `py-16` minimum
- **No illustrations, no emoji**

### 3.3 Error States

| Context              | Treatment                                          |
|----------------------|----------------------------------------------------|
| **Form field**       | Red border + error message below                   |
| **API error**        | Toast notification + retry option                  |
| **404 page**         | Centered: "Page introuvable" + back link           |
| **Network error**    | Banner at top: "Connexion perdue" + retry          |
| **Permission**       | "Accès non autorisé" + redirect to dashboard       |

---

## 4. Accessibility (a11y)

### 4.1 WCAG 2.1 AA Compliance

| Requirement          | Implementation                                    |
|----------------------|---------------------------------------------------|
| **Color contrast**   | 4.5:1 minimum for text, 3:1 for large text        |
| **Focus indicators** | Gold focus ring (`ring-2 ring-gold-400`)           |
| **Keyboard nav**     | All interactive elements reachable via Tab         |
| **Screen readers**   | Semantic HTML, ARIA labels where needed            |
| **Motion**           | Respect `prefers-reduced-motion`                   |

### 4.2 Contrast Ratios (Verified)

| Combination                        | Ratio  | Pass |
|------------------------------------|--------|------|
| `noir-950` on `surface`            | 18.4:1 | ✓    |
| `noir-900` on `surface`            | 16.2:1 | ✓    |
| `noir-600` on `surface`            | 5.7:1  | ✓    |
| `noir-400` on `surface`            | 4.6:1  | ✓    |
| `gold-700` on `surface`            | 5.2:1  | ✓    |
| `gold-400` on `noir-950`           | 8.1:1  | ✓    |
| `white` on `noir-950`              | 19.3:1 | ✓    |
| `white` on `gold-500`              | 3.2:1  | ✓ (large text only) |
| `noir-950` on `gold-400`           | 5.8:1  | ✓    |

### 4.3 Focus Management

- **Focus ring**: `ring-2 ring-gold-400 ring-offset-2` (gold signature)
- **Focus ring on dark**: `ring-2 ring-gold-400 ring-offset-noir-950`
- **Tab order**: Logical, follows visual layout
- **Focus trap**: Inside modals when open
- **Skip link**: "Aller au contenu principal" (hidden until focused)

### 4.4 Semantic HTML

| UI Element     | HTML Element                    |
|----------------|---------------------------------|
| **Page title** | `<h1>`                          |
| **Section**    | `<section>` with `aria-label`   |
| **Nav**        | `<nav>` with `aria-label`       |
| **Table**      | `<table>` with `<thead>/<tbody>` |
| **Button**     | `<button>` (never `<div>`)      |
| **Link**       | `<a>` or TanStack `<Link>`      |
| **Form**       | `<form>` with `<label>` for each input |
| **Modal**      | `role="dialog"`, `aria-modal="true"` |

---

## 5. Motion Design

### 5.1 Motion Principles

1. **Purposeful** — Motion communicates state change, not decoration
2. **Subtle** — Luxury motion is barely noticeable but deeply felt
3. **Consistent** — Same type of change = same animation
4. **Fast** — 150-250ms for UI, 300-400ms for content transitions

### 5.2 Animation Inventory

| Trigger              | Animation                    | Duration | Easing                     |
|----------------------|------------------------------|----------|----------------------------|
| **Card hover**       | `translateY(-1px)` + shadow  | 200ms    | `ease-out`                 |
| **Button press**     | `scale(0.98)`                | 100ms    | `ease-in`                  |
| **Button release**   | `scale(1)`                   | 150ms    | `ease-out`                 |
| **Modal enter**      | `scale(0.95)` → `scale(1)` + fade | 200ms | `cubic-bezier(.4,0,.2,1)` |
| **Modal exit**       | `scale(1)` → `scale(0.95)` + fade | 150ms | `ease-in`               |
| **Toast enter**      | `translateX(100%)` → `translateX(0)` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| **Toast exit**       | `translateX(0)` → `translateX(100%)` | 200ms | `ease-in`              |
| **Sidebar open**     | `translateX(-100%)` → `translateX(0)` | 250ms | `cubic-bezier(.4,0,.2,1)` |
| **Dropdown open**    | `scaleY(0.95)` → `scaleY(1)` + fade | 150ms | `ease-out`             |
| **Image hover**      | `scale(1.03)`                | 400ms    | `ease-out`                 |
| **Skeleton shimmer** | Background sweep             | 1500ms   | `ease-in-out` (loop)       |
| **Page transition**  | Fade content (opacity)       | 200ms    | `ease-out`                 |

### 5.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.4 What NOT to Animate

- **No bounce/spring** — playful, not luxurious
- **No parallax scrolling** — distracting, performance cost
- **No page-level slide transitions** — keep it instant
- **No loading spinners** — use skeletons
- **No confetti/celebration** — unprofessional
- **No auto-playing carousels** — let users control

---

## 6. Touch & Mobile UX

### Touch Targets
- Minimum: 44×44px (iOS HIG standard)
- Recommended: 48×48px for primary actions
- Spacing between targets: minimum 8px

### Mobile-Specific Patterns

| Pattern              | Implementation                                    |
|----------------------|---------------------------------------------------|
| **Sidebar**          | Full overlay, swipe-to-close                      |
| **Tables**           | Horizontal scroll, sticky first column            |
| **Modals**           | Full-screen on mobile                             |
| **Filters**          | Collapsible panel or bottom sheet                 |
| **Actions**          | Bottom-fixed bar for primary actions              |
| **Pull to refresh**  | Not implemented (use explicit refresh)            |

### Gesture Support (Future)
- Swipe left on table row → quick actions
- Swipe right on kanban card → move to next stage
- Long press → context menu

---

## 7. Performance UX

### Perceived Performance

| Technique            | Implementation                                    |
|----------------------|---------------------------------------------------|
| **Skeleton screens** | Show immediately, replace with data               |
| **Optimistic UI**    | Update UI before API confirms (with rollback)     |
| **Prefetching**      | TanStack Router prefetch on link hover            |
| **Image lazy load**  | `loading="lazy"` for below-fold images            |
| **Stale-while-revalidate** | TanStack Query default strategy            |

### Loading Budget

| Action               | Target      | Maximum     |
|----------------------|-------------|-------------|
| **Page load (FCP)**  | < 1.0s      | < 2.0s      |
| **Route transition** | < 200ms     | < 500ms     |
| **API response**     | < 300ms     | < 1.0s      |
| **Search results**   | < 100ms     | < 300ms     |
| **Image load**       | Progressive | < 3.0s      |

---

## 8. Information Architecture

### Data Density Guidelines

| Context              | Density    | Rows/Items Visible | Notes                    |
|----------------------|------------|---------------------|--------------------------|
| **KPI cards**        | Low        | 4 cards             | Scannable at a glance    |
| **Activity feed**    | Medium     | 5-8 items           | Scrollable               |
| **Data table**       | High       | 10-20 rows          | Pagination or infinite scroll |
| **Kanban board**     | Medium     | 3-5 cards/column    | Scrollable columns       |
| **Vehicle catalog**  | Medium     | 6-9 cards           | Pagination               |

### Hierarchy of Information

For any screen, information priority follows:

1. **What** — The primary data (vehicle name, deal amount, customer name)
2. **Status** — Current state (available, negotiation, active)
3. **When** — Temporal context (date, "il y a 2h")
4. **Who** — Attribution (sales person, customer)
5. **Actions** — What can be done (edit, view, delete)

This maps to visual weight:
1. **What** → Large, bold, `noir-950`
2. **Status** → Badge, semantic color
3. **When** → Small, `noir-400`
4. **Who** → Small, `noir-400`
5. **Actions** → Ghost buttons, right-aligned
