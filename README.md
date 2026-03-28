# Mansour Holding — Plateforme Pro

Monorepo for the Mansour Holding digital platform: public websites + internal dashboard for Mansour Motors.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, TailwindCSS 4, TanStack Router, Framer Motion |
| API | Hono, Bun HTTP server |
| Database | Neon PostgreSQL (serverless), Drizzle ORM |
| Auth | better-auth (email/password, bearer token) |
| Storage | Cloudflare R2 (vehicle images) |
| Deployment | Vercel (web), Koyeb (API) |

## Monorepo structure

```
mansour_holding/
├── apps/
│   ├── web/          # React frontend (Vercel)
│   └── api/          # Hono API (Koyeb)
└── packages/
    ├── shared/       # Zod validators & shared types
    ├── database/     # Drizzle schema (reference)
    └── domain/       # Business logic (placeholder)
```

## Local development

**Prerequisites:** Bun ≥ 1.2

```bash
# Install all dependencies
bun install

# Start API (port 3000)
cd apps/api && bun run dev

# Start web (port 5173)
cd apps/web && bun run dev
```

### Environment variables

`apps/api/.env` — copy and fill in:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<openssl rand -hex 32>
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Cloudflare R2 (vehicle image uploads)
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=mansour-assets
R2_PUBLIC_URL=https://pub-<hash>.r2.dev
```

`apps/web` uses Vite env vars — create `apps/web/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

### Seed the database

```bash
cd apps/api && bun run db:seed
# Creates admin@mansour.sn / admin123456
```

### Push schema changes

```bash
cd apps/api && bunx drizzle-kit push
```

## Production URLs

| Service | URL |
|---|---|
| Frontend | https://mansour-holding.vercel.app |
| API | https://integral-adel-wadeweb-04b62073.koyeb.app |
| API health | https://integral-adel-wadeweb-04b62073.koyeb.app/api/health |

## API routes

All routes under `/api/*`. Auth routes handled by better-auth at `/api/auth/*`.

Protected routes require `Authorization: Bearer <token>` header (token stored in `localStorage` as `better-auth-token`).

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/sign-in/email` | Login |
| POST | `/api/auth/sign-up/email` | Register |
| GET | `/api/vehicles` | List vehicles (pagination, search, status filter) |
| GET | `/api/vehicles/:id` | Get vehicle |
| POST | `/api/vehicles` | Create vehicle |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |
| POST | `/api/vehicles/:id/images` | Upload image to R2 |
| GET | `/api/customers` | List customers (pagination, search) |
| GET | `/api/customers/:id` | Get customer |
| POST | `/api/customers` | Create customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

## Dashboard routes

| Path | Page |
|---|---|
| `/dashboard` | Holding overview |
| `/dashboard/motors` | Motors KPI dashboard |
| `/dashboard/motors/inventory` | Vehicle list (TanStack Table) |
| `/dashboard/motors/inventory/new` | Add vehicle |
| `/dashboard/motors/inventory/:id` | Vehicle detail / edit / images |
| `/dashboard/motors/customers` | Customer list |
| `/dashboard/motors/customers/:id` | Customer detail |
| `/dashboard/motors/sales` | Sales pipeline (Kanban — WIP) |

## Public routes

| Path | Page |
|---|---|
| `/` | Holding landing page |
| `/mansour-motors` | Mansour Motors brand page |
| `/mansour-motors/vehicules` | Public vehicle catalog |
| `/mansour-motors/vehicules/:id` | Vehicle detail (fetches from API for UUID ids) |

## Vehicle extras

Vehicles support arbitrary key/value extra features (e.g. "Toit ouvrant" → "Panoramique"). These are stored as `jsonb` in the `extras` column and rendered as additional tiles in the public specs strip.

## Deployment

**API (Koyeb):** Auto-deploys from `main` via GitHub. Requires these env vars set in Koyeb dashboard:
`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

**Frontend (Vercel):** Auto-deploys from `main`. Requires `VITE_API_URL` set in Vercel dashboard.
