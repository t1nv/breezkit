<div align="center">
  <br/>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/t1nv/breezkit/main/public/logo-dark.svg">
    <img alt="Breezkit" src="https://raw.githubusercontent.com/t1nv/breezkit/main/public/logo.svg" width="180" height="auto">
  </picture>
  <h1 align="center">Breezkit</h1>
  <p align="center">
    <strong>AI-Powered Financial Intelligence</strong>
  </p>
  <p align="center">
    Toma el control de tu futuro financiero con inteligencia artificial.
    <br/>
    Planea, ahorra e invierte de forma inteligente.
  </p>
  <br/>
  <div>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19"/>
    <img src="https://img.shields.io/badge/TanStack_Start-1.0-FF4154?logo=react&logoColor=white" alt="TanStack Start"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4"/>
    <img src="https://img.shields.io/badge/shadcn/ui-000000?logo=shadcnui&logoColor=white" alt="shadcn/ui"/>
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white" alt="Supabase"/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  </div>
  <br/>
</div>

---

## Features

- **AI Financial Analysis** — Smart insights into your spending, saving, and investment patterns
- **Real-time Dashboard** — Beautiful, responsive analytics with animated charts
- **Multi-language** — Full i18n support (ES/EN) with seamless switching
- **Smart Alerts** — Proactive notifications for unusual spending and budget limits
- **Goal Tracking** — Set and monitor financial goals with visual progress
- **Secure Auth** — Supabase-powered authentication with session management
- **SSR + Streaming** — Blazing-fast page loads with TanStack Start server-side rendering
- **Motion Design** — Fluid animations powered by Motion (Framer Motion)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19) |
| **Routing** | [TanStack Router](https://tanstack.com/router) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com) |
| **Backend / Auth** | [Supabase](https://supabase.com) |
| **Animation** | [Motion](https://motion.dev) (formerly Framer Motion) |
| **Forms** | React Hook Form + Zod |
| **i18n** | react-i18next |
| **Charts** | Recharts |
| **Bundler** | Vite |
| **Language** | TypeScript |

## Getting Started

### Prerequisites

- Node.js >= 20
- npm / bun

### Installation

```bash
# Clone the repository
git clone https://github.com/t1nv/breezkit.git
cd breezkit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build

```bash
npm run build
npm run preview
```

## Environment Variables

```env
# Required — Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```

## Project Structure

```
src/
├── assets/           # Static assets
├── components/       # UI components
│   └── landing/      # Landing page sections
├── hooks/            # Custom React hooks
├── integrations/     # Third-party integrations (Supabase)
├── lib/              # Utilities, i18n config
├── routes/           # TanStack Router file-based routes
├── router.tsx        # Router configuration
├── server.ts         # Server entry
├── start.ts          # App bootstrap
└── styles.css        # Global styles + Tailwind
```

---

<div align="center">
  <sub>Built with ❤️ and TypeScript</sub>
  <br/>
  <sub>&copy; 2026 Breezkit. All rights reserved.</sub>
</div>
