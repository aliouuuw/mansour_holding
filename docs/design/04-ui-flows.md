# Mansour Holding — UI Flows & Wireframes

> User journeys, screen inventory, navigation architecture, and ASCII wireframes.
> Every flow reflects the **luxury / refined** aesthetic: authoritative, minimal, gold-accented.

---

## 1. Site Map & Navigation Architecture

### Public Site (mansourholding.com)

```
/                           → Landing Page (Holding overview)
/vehicules                  → Public Vehicle Catalog (Mansour Motors)
/vehicules/:id              → Public Vehicle Detail
/login                      → Authentication (Login)
/register                   → Authentication (Register)
```

### Dashboard App (app.mansourholding.com)

```
/dashboard                  → Holding Overview (all businesses)
/dashboard/motors           → Motors Dashboard (KPIs, activity, pipeline)
/dashboard/motors/inventory → Vehicle Inventory (table)
/dashboard/motors/inventory/:id → Vehicle Detail (admin)
/dashboard/motors/sales     → Sales Pipeline (kanban)
/dashboard/motors/customers → Customer CRM (table)
/dashboard/motors/customers/:id → Customer Detail (future)
/dashboard/settings         → Account & Business Settings (future)
```

---

## 2. User Personas & Journeys

### Persona A: Directeur Général (Aliou)
- **Role**: Holding administrator, sees everything
- **Primary flow**: Login → Holding Overview → Motors Dashboard → Sales Pipeline
- **Needs**: High-level KPIs, cross-business performance, quick drill-down
- **Frequency**: Daily, 5-10 min sessions

### Persona B: Commercial (Ousmane)
- **Role**: Sales staff at Mansour Motors
- **Primary flow**: Login → Motors Dashboard → Sales Pipeline → Deal Detail
- **Needs**: Pipeline management, customer contact, deal progression
- **Frequency**: All day, primary work tool

### Persona C: Client Potentiel (Amadou)
- **Role**: Public visitor, potential buyer
- **Primary flow**: Landing → Vehicles → Vehicle Detail → Contact Form
- **Needs**: Browse inventory, see prices, contact dealer
- **Frequency**: One-time or occasional

---

## 3. Screen Wireframes

### 3.1 Landing Page

```
┌──────────────────────────────────────────────────────────────┐
│ ▪ MANSOUR HOLDING              Véhicules  Connexion  [CTA]  │ ← noir-950 header
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │ ← noir-950 bg
│    L'EXCELLENCE,                                             │ ← Display XL, white
│    UNE ENTREPRISE À LA FOIS                                  │
│                                                              │
│    Groupe diversifié basé au Sénégal.                        │ ← Body LG, silver-300
│    Automobile · Immobilier · Construction                    │
│                                                              │
│    [ Découvrir nos véhicules ]  [ Nos entreprises ]          │ ← Gold CTA + Ghost CTA
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│    7              150+           10+           1000+          │ ← Stats bar
│    Entreprises    Employés       Années        Clients       │    surface-dim bg
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│    NOS ENTREPRISES                                           │ ← Section title
│                                                              │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│    │ Motors   │  │ Immo     │  │ Location │                 │ ← Business cards
│    │ ▪ Car    │  │ ▪ Home   │  │ ▪ Key    │                 │    noir-900 bg
│    │ Premium  │  │ Bientôt  │  │ Bientôt  │                 │    gold icon accent
│    └──────────┘  └──────────┘  └──────────┘                 │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│    │ Constr.  │  │ Parfums  │  │ Grooming │                 │
│    └──────────┘  └──────────┘  └──────────┘                 │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│    À PROPOS                                                  │ ← noir-950 bg section
│    [Values grid: Innovation, Excellence, Intégrité, ...]     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ ▪ MANSOUR HOLDING    Entreprises    Liens    Contact         │ ← noir-950 footer
│ © 2026 Mansour Holding                                       │    silver-400 text
└──────────────────────────────────────────────────────────────┘
```

**Key design changes from current:**
- Header: black background, not white
- Hero: tighter typography, gold CTA (not white button)
- Business cards: dark cards on light section (inverted from current)
- Footer: black, not light gray
- Overall: more contrast, more authority

---

### 3.2 Authentication (Login)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                        noir-950 full background              │
│                                                              │
│              ▪ MANSOUR HOLDING                               │ ← Gold icon + white text
│                                                              │
│         ┌────────────────────────────┐                       │
│         │                            │                       │
│         │  CONNEXION                 │                       │ ← white, H2
│         │  Accédez à votre espace    │                       │ ← silver-400
│         │                            │                       │
│         │  Adresse email             │                       │
│         │  ┌────────────────────┐    │                       │ ← dark input: noir-800 bg
│         │  │ votre@email.com    │    │                       │    white text, gold focus
│         │  └────────────────────┘    │                       │
│         │                            │                       │
│         │  Mot de passe              │                       │
│         │  ┌────────────────────┐    │                       │
│         │  │ ••••••••       [👁] │    │                       │
│         │  └────────────────────┘    │                       │
│         │                            │                       │
│         │  □ Se souvenir    Oublié?  │                       │ ← silver-400 + gold link
│         │                            │                       │
│         │  [ SE CONNECTER ]          │                       │ ← Gold button, full width
│         │                            │                       │
│         │  Pas de compte? Créer      │                       │ ← silver-400 + gold link
│         │                            │                       │
│         └────────────────────────────┘                       │
│                                                              │
│              © 2026 Mansour Holding                          │ ← silver-500, small
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key design changes from current:**
- Full dark background (not split white/blue)
- Centered card on dark canvas — more dramatic
- Dark inputs (noir-800) with gold focus rings
- Gold CTA button
- No left panel illustration — pure minimalism

---

### 3.3 Dashboard Layout

```
┌─────────┬────────────────────────────────────────────────────┐
│         │  Header                                    🔔  AW  │ ← surface bg, border-b
│ noir-950│                                                    │
│         ├────────────────────────────────────────────────────┤
│ ▪ MH    │                                                    │
│         │  Page Content Area                                 │ ← surface-dim bg
│─────────│                                                    │
│ Vue     │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ │
│ d'ens.  │  │ KPI 1    │ │ KPI 2    │ │ KPI 3    │ │KPI 4 │ │
│         │  └──────────┘ └──────────┘ └──────────┘ └──────┘ │
│─────────│                                                    │
│ MOTORS  │  ┌─────────────────────────┐ ┌────────────────┐   │
│ Tableau │  │                         │ │                │   │
│ Invent. │  │  Activity Feed          │ │  Pipeline      │   │
│ Ventes  │  │                         │ │  Summary       │   │
│ Clients │  │                         │ │                │   │
│         │  └─────────────────────────┘ └────────────────┘   │
│─────────│                                                    │
│         │                                                    │
│ AW      │                                                    │
│ Admin   │                                                    │
└─────────┴────────────────────────────────────────────────────┘
```

**Sidebar design:**
- `noir-950` background (pure black)
- Logo: gold icon + white "MH" text
- Active nav item: `bg-white/10`, gold left border (`border-l-2 border-gold-400`)
- Inactive: `silver-400` text, `silver-300` icons
- Section headers: `gold-400`, 11px, `uppercase tracking-widest`
- User avatar at bottom: `noir-800` circle, `gold-300` initials

---

### 3.4 Motors Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  MANSOUR MOTORS                    [ Inventaire ] [ + Affaire ] │
│  Tableau de bord du concessionnaire                          │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────┐│
│  │ VÉHICULES   │ │ AFFAIRES    │ │ REVENUS     │ │CLIENTS ││
│  │ EN STOCK    │ │ EN COURS    │ │ DU MOIS     │ │ACTIFS  ││
│  │             │ │             │ │             │ │        ││
│  │ 6           │ │ 4           │ │ 111,5M      │ │ 6      ││
│  │ 8 total     │ │ 8 total     │ │ +23%        │ │ +3     ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────┘│
│                                                              │
│  ┌─────────────────────────────┐ ┌──────────────────────────┐│
│  │ ACTIVITÉ RÉCENTE            │ │ PIPELINE DES VENTES      ││
│  │─────────────────────────────│ │──────────────────────────││
│  │ ● Vente conclue — Lexus..  │ │ ● Prospects        2     ││
│  │ ● Nouveau prospect — ...   │ │ ● Négociation      2     ││
│  │ ● Essai programmé — ...    │ │ ● Essai            1     ││
│  │ ● Nouveau véhicule — ...   │ │ ● Conclu           2     ││
│  │ ● Négociation — ...        │ │ ● Perdu            1     ││
│  └─────────────────────────────┘ │                          ││
│                                  │ Voir le pipeline →       ││
│                                  └──────────────────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key changes:**
- KPI labels: uppercase, tracked, 12px (overline style)
- KPI values: large, bold, noir-950
- Activity icons: minimal dots (semantic color), no colored backgrounds
- Pipeline dots: small colored circles, not colored badges
- "Voir le pipeline" link: gold text with arrow

---

### 3.5 Inventory Table

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  INVENTAIRE                              [ + Ajouter ]       │
│  8 véhicules · 6 disponibles                                │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ 🔍 Rechercher...          [Tous] [Dispo] [Rés.] [Vendu] ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ VÉHICULE          ANNÉE  KM        PRIX        STATUT   ││ ← noir-50 bg, uppercase
│  │──────────────────────────────────────────────────────────││
│  │ [img] Toyota LC   2024   1 200     45 000 000  DISPO    ││
│  │ [img] Mercedes    2024   800       52 000 000  DISPO    ││
│  │ [img] BMW X5      2023   15 000    38 000 000  RÉSERVÉ  ││
│  │ [img] Range Rover 2024   500       62 000 000  DISPO    ││
│  │ ...                                                      ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key changes:**
- Filter chips: `noir-950` bg when active (not blue), `noir-100` bg when inactive
- Status badges: rectangular (rounded 4px), uppercase, small
- Prices: right-aligned, bold, tabular-nums
- Row hover: very subtle `noir-50/50`
- Add button: `gold` variant

---

### 3.6 Sales Pipeline (Kanban)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  PIPELINE DES VENTES                     [ + Nouvelle affaire ] │
│  8 affaires · Pipeline: 170M · Conclu: 111,5M               │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐│
│  │▌PROSPECT   │ │▌NÉGOCIATION│ │▌ESSAI      │ │▌CONCLU     ││ ← gold left border
│  │ 2 · 84M    │ │ 2 · 68,5M  │ │ 1 · 37,5M  │ │ 2 · 111,5M ││   on active column
│  │            │ │            │ │            │ │            ││
│  │┌──────────┐│ │┌──────────┐│ │┌──────────┐│ │┌──────────┐││
│  ││ Aïssatou ││ ││ Fatou    ││ ││ Moussa   ││ ││ Amadou   │││
│  ││ RR Sport ││ ││ GLE 450  ││ ││ BMW X5   ││ ││ LC 300   │││
│  ││ 62M      ││ ││ 51M      ││ ││ 37,5M    ││ ││ 44,5M    │││
│  │└──────────┘│ │└──────────┘│ │└──────────┘│ │└──────────┘││
│  │┌──────────┐│ │┌──────────┐│ │            │ │┌──────────┐││
│  ││ Ibrahima ││ ││ Mariama  ││ │            │ ││ Amadou   │││
│  ││ Hilux    ││ ││ Tucson   ││ │            │ ││ LX 600   │││
│  ││ 22M      ││ ││ 17,5M    ││ │            │ ││ 67M      │││
│  │└──────────┘│ │└──────────┘│ │            │ │└──────────┘││
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key changes:**
- Column header: gold left border accent (not colored top border)
- Column bg: `noir-50` (warm, not cold gray)
- Deal cards: white, `border border-border`, `shadow-xs`
- No colored status badges on cards (column position = status)
- Prices: bold, right-aligned within card

---

### 3.7 Public Vehicle Catalog

```
┌──────────────────────────────────────────────────────────────┐
│ ▪ MANSOUR MOTORS  par Mansour Holding    📞 +221..  [Pro]   │ ← noir-950 header
├──────────────────────────────────────────────────────────────┤
│                                                              │
│              TROUVEZ VOTRE VÉHICULE IDÉAL                    │ ← noir-950 bg
│              Sélection premium · Garantie · Service          │    white text
│                                                              │
│              ┌──────────────────────────────┐                │
│              │ 🔍 Rechercher...              │                │ ← dark input
│              └──────────────────────────────┘                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  6 véhicules disponibles                          [Filtres]  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ [Image]      │  │ [Image]      │  │ [Image]      │       │
│  │              │  │              │  │              │       │
│  │ Toyota LC300 │  │ Mercedes GLE │  │ RR Sport HSE │       │
│  │ 2024 · 1200km│  │ 2024 · 800km │  │ 2024 · 500km │       │
│  │ 45 000 000   │  │ 52 000 000   │  │ 62 000 000   │       │
│  │ Voir →       │  │ Voir →       │  │ Voir →       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  Vous ne trouvez pas?  [ Appelez-nous ]                      │ ← CTA section
├──────────────────────────────────────────────────────────────┤
│ ▪ MANSOUR HOLDING  © 2026                                    │ ← noir-950 footer
└──────────────────────────────────────────────────────────────┘
```

**Key changes:**
- Header: black, not white/transparent
- Vehicle cards: price displayed prominently, gold "Voir →" link
- Search input on dark bg: `noir-800` bg, white text, gold focus
- Footer: black

---

## 4. Navigation Patterns

### Sidebar Navigation (Dashboard)

```
┌─────────────────────┐
│ ▪ MANSOUR HOLDING   │  ← Gold icon, white text, uppercase tracked
│ Plateforme          │  ← silver-500, 11px
├─────────────────────┤
│ ▌ Mansour Motors ▾  │  ← Business switcher: noir-800 bg, gold border
├─────────────────────┤
│                     │
│ Vue d'ensemble      │  ← If active: bg-white/10, border-l-2 gold
│                     │
│ MANSOUR MOTORS      │  ← Section header: gold-400, uppercase, tracked
│ ▌Tableau de bord    │
│  Inventaire         │
│  Ventes             │
│  Clients            │
│                     │
├─────────────────────┤
│ AW                  │  ← Avatar: noir-800 bg, gold-300 initials
│ Aliou Wade          │
│ Administrateur      │  ← silver-500
└─────────────────────┘
```

### Active State Signature
- Left gold border: `border-l-2 border-gold-400`
- Background: `bg-white/10`
- Text: `white` (from `silver-400` inactive)
- This gold-left-border pattern is the **signature navigation indicator**

---

## 5. Interaction Flows

### Flow A: Add Vehicle to Inventory

```
Motors Dashboard
  → Click "Ajouter un véhicule" (gold button)
  → Modal opens (centered, dark backdrop)
  → Fill form: make, model, year, price, photos, specs
  → Click "Ajouter" (gold button)
  → Toast: "Véhicule ajouté"
  → Redirect to vehicle detail page
```

### Flow B: Progress a Deal

```
Sales Pipeline
  → Click deal card in "Prospect" column
  → Side panel or modal opens with deal details
  → Click "Passer en négociation" (primary button)
  → Card animates to "Négociation" column
  → Toast: "Affaire mise à jour"
```

### Flow C: Public Vehicle Inquiry

```
Public Vehicles
  → Click vehicle card
  → Vehicle Detail page loads
  → Scroll to contact form (right panel)
  → Fill: name, phone, email, message
  → Click "Envoyer ma demande" (gold button)
  → Toast: "Demande envoyée"
  → Form resets
```

### Flow D: Business Switching

```
Dashboard (any page)
  → Click business switcher in sidebar
  → Dropdown shows all businesses
  → Active businesses: clickable, gold dot
  → Inactive: grayed out, "Bientôt" label
  → Click "Mansour Motors"
  → Navigate to /dashboard/motors
  → Sidebar nav updates to Motors context
```
