<div align="center">
  <br/>
  <img alt="Breezkit" src="./public/logo.svg" width="120" height="auto">

  <h1>Breezkit</h1>

  <p>
    <strong>AI-Powered Financial Intelligence</strong>
    <br/>
    Toma el control de tu futuro financiero. Planea, ahorra e invierte de forma inteligente.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19"/>
    <img src="https://img.shields.io/badge/TanStack_Start-FF4154?logo=react&logoColor=white" alt="TanStack Start"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4"/>
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white" alt="Supabase"/>
    <img src="https://img.shields.io/badge/Claude_API-D97757?logo=anthropic&logoColor=white" alt="Claude API"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  </p>
</div>

---

## Overview

Breezkit is a full-stack personal-finance platform for Spanish-speaking users
(PYG-first, multi-currency). Users track transactions, budgets, and goals; an
AI advisor powered by **Claude** analyzes their financial profile and recent
movements and answers in plain Spanish with concrete recommendations.

Built with **TanStack Start** (SSR), **React 19**, **Tailwind CSS v4**, and
**Supabase** (auth + Postgres with row-level security).

## Features

- **🤖 AI advisor** — chat with Claude about your own numbers: income, expenses,
  savings, debts, risk profile, and goals. Every reply starts with a financial
  conduct classification (Conservadora / Moderada / Agresiva). Contextual AI
  insight cards on the dashboard.
- **📊 Dashboard** — monthly balance, income vs. expense breakdown, savings
  rate, budgets with per-category limits and progress, goals with target dates,
  transaction history with filters and CSV export.
- **🔐 Security** — Supabase Auth with guarded routes, RLS on every table,
  strict CSP with per-request script nonces, security headers (HSTS, COOP,
  CORP, frame-deny), origin validation on server functions, and layered rate
  limiting (per-IP in-memory + per-user DB-backed for AI calls).
- **🌐 i18n** — Spanish (source of truth), English, French, and Portuguese via
  react-i18next with browser detection and instant switching.
- **🎨 Design system** — warm ivory + terracotta identity, Lora display serif +
  Bricolage Grotesque body, full dark mode, `prefers-reduced-motion` support,
  WCAG 2.1 AA contrast targets. See `PRODUCT.md` and `DESIGN.md`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (React 19, SSR) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Backend / Auth | [Supabase](https://supabase.com) (Postgres + RLS, Auth) |
| AI | [Claude API](https://platform.claude.com) via `@anthropic-ai/sdk` (OpenAI-compatible fallback supported) |
| State | TanStack Query |
| Animation | [Motion](https://motion.dev) |
| Forms / Validation | React Hook Form + Zod 4 |
| Charts | Recharts |
| Tooling | Vite 7 · TypeScript 5.8 · ESLint 10 · Prettier · Vitest |

## Getting Started

### Prerequisites

- Node.js ≥ 20 (npm ≥ 10) or Bun ≥ 1.0
- A [Supabase](https://supabase.com) project (free tier works)
- An [Anthropic API key](https://platform.claude.com) for the AI features (optional — the app runs without it)

### Setup

```bash
git clone https://github.com/t1nv/breezkit.git
cd breezkit
npm install

# Environment
cp .env.example .env         # fill in your Supabase URL + anon key (+ ANTHROPIC_API_KEY)
cp supabase/config.toml.example supabase/config.toml   # your Supabase project ref (optional, for the CLI)
```

Create the database schema: open the Supabase **SQL Editor**, paste the whole
of [`setup-database.sql`](./setup-database.sql), and run it. (Equivalent
incremental migrations live in `supabase/migrations/`.)

```bash
npm run dev                  # http://localhost:3000
```

### Scripts

```bash
npm run dev        # dev server
npm run build      # production build (Node server preset, see vite.config.ts)
npm run preview    # preview the production build
npm test           # vitest
npm run lint       # eslint
npm run format     # prettier
```

## Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_PROJECT_ID` | Yes | Supabase project ref |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PROJECT_ID` | Yes | Client-exposed copies of the above |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Admin operations. **Never expose.** |
| `ANTHROPIC_API_KEY` | Optional | Enables the AI advisor (Claude). |
| `AI_MODEL` / `AI_MODEL_LIGHT` | Optional | Chat model (default `claude-opus-4-8`) / faster model for insight cards |
| `AI_BASE_URL` + `AI_API_KEY` | Optional | Any OpenAI-compatible provider, used only when `ANTHROPIC_API_KEY` is unset |
| `RATE_LIMITER_FILE` | Optional | Persist rate-limit state across restarts (Node only) |
| `DISABLE_RATE_LIMITER` | Dev only | `"true"` bypasses rate limiting |

See [`.env.example`](./.env.example) for the full annotated list.
**`.env` and `supabase/config.toml` are gitignored — no project refs or keys
are committed to this repository.**

## Project Structure

```
src/
├── components/
│   ├── brand/            # logo
│   ├── dashboard/        # tab views (resumen, transacciones, presupuestos, metas, perfil, asesor, empresa)
│   ├── icons/            # inline SVG icons
│   ├── landing/          # landing sections + shared SectionHeader/Reveal
│   └── ui/               # shadcn/ui primitives
├── hooks/                # use-dark-mode, use-mobile
├── integrations/supabase/# clients, auth middleware (RLS-scoped + admin)
├── lib/
│   ├── ai.functions.ts   # Claude server functions (chat, insights)
│   ├── security-headers.ts / rate-limiter.server.ts / http-error.ts
│   └── i18n/             # es · en · fr · pt
├── routes/               # file-based routes (auth guard in _authenticated.tsx)
├── server.ts             # SSR wrapper: security headers + CSP nonces
└── styles.css            # Tailwind v4 tokens + design system
supabase/migrations/      # schema + RLS policies
setup-database.sql        # one-shot schema for the Supabase SQL editor
```

## Security Notes

- All tables use **row-level security**; users can only read/write their own rows.
- Server functions validate the Supabase JWT, check the request origin, and
  are rate-limited per IP; AI chat is additionally capped per user per hour.
- Production responses ship a nonce-based CSP (`strict-dynamic`, no
  `unsafe-inline` scripts) plus HSTS, COOP/CORP, and frame-deny headers.
- Secrets live only in `.env` (gitignored). Rotate any key you believe leaked.

## License

Proprietary software. All rights reserved.

---

<div align="center">
  <sub>© 2026 <a href="https://github.com/t1nv">t1nv</a> · Built with TypeScript</sub>
</div>
