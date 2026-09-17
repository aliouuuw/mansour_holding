# Mansour Holding — Plateforme Pro

One Next.js app. Pages and `/api` share the same origin. Deploy on Vercel.

## Stack

| Layer | Tech |
|---|---|
| App | Next.js (App Router), React 19, TailwindCSS 4 |
| API | Next.js server actions + better-auth at `/api/auth` |
| Database | Neon PostgreSQL, Drizzle ORM |
| Auth | better-auth (email/password, cookies) |
| Storage | Cloudflare R2 |
| Deploy | Vercel |

## Local

```bash
bun install
cp .env.example .env.local
bun run dev
```

App: `http://localhost:3000`

`bun run db:seed` creates `admin@mansour.sn` / `admin123456`.

## Vercel

Import this GitHub repo. Root Directory stays empty (repo root). Add env vars:

`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

Set `BETTER_AUTH_URL` and `FRONTEND_URL` to `https://mansour-holding.vercel.app`.
