# RyuZen Frontend

Frontend for the RyuZen platform. React + Vite + TypeScript + Tailwind CSS + shadcn/ui + TanStack Query + React Hook Form + Zod + Axios.

Built incrementally against the Master Implementation Roadmap — one milestone at a time.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (project references) and produce a production build
- `npm run typecheck` — type-check only, no emit
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier

## Environment Variables

See `.env.example`. `VITE_API_BASE_URL` must point at a running instance of the RyuZen backend (`/api/v1`).

## Status

Current milestone: **F1 — Project Scaffolding & Tooling** (complete).
See the progress report delivered alongside each milestone for full status.
