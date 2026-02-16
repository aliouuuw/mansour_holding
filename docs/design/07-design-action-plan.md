# Mansour Holding — Design Action Plan

> Implementation roadmap to migrate from the current generic SaaS blue UI
> to the luxury black + gold + silver brand identity.

---

## 1. Current State Assessment

### What Exists (Working)
- ✅ Full page structure: landing, auth, dashboard, public catalog
- ✅ TanStack Router with all routes defined
- ✅ TanStack Table for inventory and customers
- ✅ Kanban board for sales pipeline
- ✅ Mock data for vehicles, deals, customers, activity
- ✅ Responsive layout with sidebar
- ✅ Plus Jakarta Sans font
- ✅ `cn()` utility for class merging

### What Must Change (Brand Pivot)
- ❌ **Color system**: Blue primary → Noir + Gold + Silver
- ❌ **Border radius**: Rounded-xl everywhere → Sharp (4-6px)
- ❌ **Shadows**: Cold blue-gray → Warm black-based
- ❌ **Icon treatment**: Colored backgrounds → Monochrome
- ❌ **Auth layout**: Split blue/white → Full dark
- ❌ **Public header**: White → Black
- ❌ **Footer**: Light gray → Black
- ❌ **Status colors**: Neon → Desaturated luxury
- ❌ **Spacing**: Standard SaaS → Generous luxury
- ❌ **Component extraction**: Inline styles → Reusable components

---

## 2. Implementation Phases

### Phase 0: Foundation (Design Tokens)
**Effort**: Small | **Impact**: Everything depends on this

| Task                                          | File                          |
|-----------------------------------------------|-------------------------------|
| Replace `@theme` color tokens in index.css    | `apps/web/src/index.css`      |
| Add semantic color tokens (success/warning/danger/info) | `apps/web/src/index.css` |
| Add gold shadow custom utility                | `apps/web/src/index.css`      |
| Update `surface-dim` to warm off-white        | `apps/web/src/index.css`      |
| Update `border` to warm gray                  | `apps/web/src/index.css`      |

**Verification**: `bunx tsc --noEmit` + visual check of all pages

---

### Phase 1: Core Layout Components
**Effort**: Medium | **Impact**: Every page changes

| Task                                          | File                          |
|-----------------------------------------------|-------------------------------|
| Restyle `DashboardLayout` sidebar (noir-950, gold accents) | `components/layout/DashboardLayout.tsx` |
| Restyle dashboard header                      | `components/layout/DashboardLayout.tsx` |
| Create `PublicLayout` component (black header/footer) | `components/layout/PublicLayout.tsx` |
| Create `AuthLayout` component (full dark)     | `components/layout/AuthLayout.tsx` |
| Create `PageHeader` component (title + actions) | `components/layout/PageHeader.tsx` |

---

### Phase 2: UI Primitives
**Effort**: Medium | **Impact**: Consistency across all features

| Task                                          | File                          |
|-----------------------------------------------|-------------------------------|
| Create `Button` component (5 variants, 4 sizes) | `components/ui/Button.tsx`  |
| Create `Input` component (light + dark variants) | `components/ui/Input.tsx`  |
| Create `Badge` component (semantic + gold)    | `components/ui/Badge.tsx`     |
| Create `Card` component (default, elevated, dark) | `components/ui/Card.tsx`  |
| Create `Modal` component (with animations)    | `components/ui/Modal.tsx`     |
| Create `Toast` component (4 variants)         | `components/ui/Toast.tsx`     |
| Create `Skeleton` component (with shimmer)    | `components/ui/Skeleton.tsx`  |
| Create `Avatar` component (dark bg, gold initials) | `components/ui/Avatar.tsx` |
| Create `EmptyState` component                 | `components/ui/EmptyState.tsx`|
| Create `Tabs` component (gold underline)      | `components/ui/Tabs.tsx`      |
| Create `Dropdown` component                   | `components/ui/Dropdown.tsx`  |
| Create `Tooltip` component                    | `components/ui/Tooltip.tsx`   |

---

### Phase 3: Composed Components
**Effort**: Small | **Impact**: Dashboard consistency

| Task                                          | File                          |
|-----------------------------------------------|-------------------------------|
| Create `KPICard` component (overline + value) | `components/shared/KPICard.tsx` |
| Create `DataTable` wrapper (styled TanStack Table) | `components/shared/DataTable.tsx` |
| Create `SearchInput` component                | `components/shared/SearchInput.tsx` |
| Create `FilterBar` component                  | `components/shared/FilterBar.tsx` |
| Create `ConfirmDialog` component              | `components/shared/ConfirmDialog.tsx` |

---

### Phase 4: Page Restyling
**Effort**: Large | **Impact**: Complete visual transformation

| Task                                          | File                          |
|-----------------------------------------------|-------------------------------|
| Restyle `LandingPage` (black header/footer, gold CTAs) | `pages/LandingPage.tsx` |
| Restyle `LoginPage` (full dark, gold CTA)     | `pages/auth/LoginPage.tsx`    |
| Restyle `RegisterPage` (full dark, gold CTA)  | `pages/auth/RegisterPage.tsx` |
| Restyle `DashboardHome` (luxury KPIs, dark business cards) | `pages/dashboard/DashboardHome.tsx` |
| Restyle `MotorsDashboard` (monochrome icons, gold accents) | `pages/dashboard/motors/MotorsDashboard.tsx` |
| Restyle `MotorsInventory` (luxury table, sharp badges) | `pages/dashboard/motors/MotorsInventory.tsx` |
| Restyle `MotorsVehicleDetail` (admin detail)  | `pages/dashboard/motors/MotorsVehicleDetail.tsx` |
| Restyle `MotorsSales` (luxury kanban)         | `pages/dashboard/motors/MotorsSales.tsx` |
| Restyle `MotorsCustomers` (luxury table)      | `pages/dashboard/motors/MotorsCustomers.tsx` |
| Restyle `PublicVehicles` (black header, gold links) | `pages/public/PublicVehicles.tsx` |
| Restyle `PublicVehicleDetail` (luxury detail) | `pages/public/PublicVehicleDetail.tsx` |

---

### Phase 5: Polish & Refinement
**Effort**: Small | **Impact**: Premium feel

| Task                                          | File                          |
|-----------------------------------------------|-------------------------------|
| Add skeleton loading states to all pages      | Various                       |
| Add empty states to all list views            | Various                       |
| Add toast notifications for actions           | Global provider               |
| Verify all focus states use gold rings        | All interactive components    |
| Verify responsive behavior on all pages       | All pages                     |
| Add `prefers-reduced-motion` support          | `index.css`                   |
| Audit contrast ratios (WCAG AA)               | All color combinations        |

---

## 3. Migration Strategy

### Approach: Big Bang (Recommended)

Since the color system change affects every component, a phased migration would leave the app in an inconsistent state. Instead:

1. **Phase 0** first — change tokens, everything breaks visually
2. **Phase 1-3** in rapid succession — fix layouts and create components
3. **Phase 4** — restyle all pages using new components
4. **Phase 5** — polish

### Token Migration Cheat Sheet

For rapid find-and-replace across all files:

| Find                    | Replace With              |
|-------------------------|---------------------------|
| `primary-950`           | `noir-950`                |
| `primary-900`           | `noir-900`                |
| `primary-800`           | `noir-800`                |
| `primary-700`           | `noir-700`                |
| `primary-600`           | `gold-400`                |
| `primary-500`           | `gold-400`                |
| `primary-400`           | `gold-300`                |
| `primary-300`           | `gold-300`                |
| `primary-200`           | `gold-200`                |
| `primary-100`           | `gold-100`                |
| `primary-50`            | `gold-50`                 |
| `accent-*`              | Remove or `gold-*`        |
| `bg-blue-*`             | Context-dependent         |
| `bg-emerald-*`          | `bg-success-*`            |
| `bg-amber-*`            | `bg-warning-*`            |
| `bg-red-*`              | `bg-danger-*`             |
| `bg-purple-*`           | `bg-info-*` or `gold-*`  |
| `rounded-xl`            | `rounded-md`              |
| `rounded-2xl`           | `rounded-lg`              |
| `rounded-lg` (buttons)  | `rounded`                 |
| `shadow-sm` (cards)     | `shadow-xs`               |

---

## 4. Quality Checklist

Before considering the redesign complete, verify:

### Visual
- [ ] All pages use noir/gold/silver palette — no blue remnants
- [ ] Sidebar is pure black with gold accents
- [ ] Auth pages are full dark background
- [ ] Public header and footer are black
- [ ] All CTAs are gold or noir-950
- [ ] Status colors are desaturated (jade/amber/garnet/steel)
- [ ] No colored icon backgrounds (no blue/green/purple circles)
- [ ] Border radius is sharp (4-6px), not bubbly (12-16px)
- [ ] Spacing is generous throughout

### Functional
- [ ] All routes work correctly
- [ ] All tables sort and filter
- [ ] All forms submit (even if mock)
- [ ] Sidebar navigation highlights correctly
- [ ] Mobile responsive on all pages
- [ ] `tsc --noEmit` passes

### Accessibility
- [ ] All text meets WCAG AA contrast
- [ ] All interactive elements have focus states (gold ring)
- [ ] All images have alt text
- [ ] Semantic HTML throughout
- [ ] Keyboard navigation works

---

## 5. Estimated Effort

| Phase   | Tasks | Estimated Time | Priority |
|---------|-------|----------------|----------|
| Phase 0 | 5     | 1 hour         | Critical |
| Phase 1 | 5     | 3 hours        | Critical |
| Phase 2 | 12    | 6 hours        | High     |
| Phase 3 | 5     | 2 hours        | High     |
| Phase 4 | 11    | 8 hours        | High     |
| Phase 5 | 6     | 3 hours        | Medium   |
| **Total** | **44** | **~23 hours** | —        |

### Recommended Execution Order

```
Phase 0 (tokens) → Phase 1 (layouts) → Phase 2 (primitives)
    → Phase 3 (composed) → Phase 4 (pages) → Phase 5 (polish)
```

Each phase should end with a `tsc --noEmit` check and a visual review.

---

## 6. Success Criteria

The redesign is successful when:

1. **First impression**: A new user sees the dashboard and thinks "premium" not "startup"
2. **Brand coherence**: Every screen feels like it belongs to the same luxury brand
3. **No blue remnants**: Zero instances of the old blue palette
4. **Professional authority**: The UI commands respect, not friendliness
5. **Functional parity**: Everything that worked before still works
6. **Performance**: No regression in load times or interaction speed
