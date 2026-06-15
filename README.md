<div align="center">
  <br/>
  <br/>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/t1nv/breezkit/main/public/logo-dark.svg">
    <img alt="Breezkit" src="https://raw.githubusercontent.com/t1nv/breezkit/main/public/logo.svg" width="200" height="auto">
  </picture>

  <h1 align="center" style="margin-top: 0.5rem; font-size: 3.5rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1;">Breezkit</h1>

  <p align="center" style="font-size: 1.25rem; color: #888; max-width: 600px; margin: 0 auto;">
    <strong>AI-Powered Financial Intelligence</strong>
    <br/>
    Toma el control de tu futuro financiero. Planea, ahorra e invierte de forma inteligente.
  </p>

  <br/>

  <div align="center">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19"/>
    <img src="https://img.shields.io/badge/TanStack_Start-1.0-FF4154?style=for-the-badge&logo=react&logoColor=white" alt="TanStack Start"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4"/>
    <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui"/>
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
    <br/>
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
    <img src="https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Motion"/>
    <img src="https://img.shields.io/badge/i18n-26A69A?style=for-the-badge&logo=google-translate&logoColor=white" alt="i18n"/>
  </div>

  <br/>

  <table align="center" style="border-collapse: collapse; border: none;">
    <tr>
      <td style="border: none; padding: 0 8px;"><a href="#features">Features</a></td>
      <td style="border: none; padding: 0 8px;">·</td>
      <td style="border: none; padding: 0 8px;"><a href="#tech-stack">Tech Stack</a></td>
      <td style="border: none; padding: 0 8px;">·</td>
      <td style="border: none; padding: 0 8px;"><a href="#getting-started">Getting Started</a></td>
      <td style="border: none; padding: 0 8px;">·</td>
      <td style="border: none; padding: 0 8px;"><a href="#project-structure">Structure</a></td>
      <td style="border: none; padding: 0 8px;">·</td>
      <td style="border: none; padding: 0 8px;"><a href="#configuration">Configuration</a></td>
    </tr>
  </table>

  <br/>
  <br/>
</div>

---

<br/>

## <a id="overview"></a>Overview

Breezkit is a modern, full-stack financial intelligence platform that leverages artificial intelligence to help users understand, manage, and grow their personal finances. Built from the ground up with **TanStack Start**, **React 19**, and **Tailwind CSS v4**, it delivers a premium user experience with server-side rendering, fluid animations, and a beautiful dark-mode interface.

Whether you're tracking daily expenses, setting long-term savings goals, or exploring investment opportunities — Breezkit provides clear, actionable insights powered by AI.

<br/>

![Dashboard Preview](https://raw.githubusercontent.com/t1nv/breezkit/main/public/og-image.png)

<br/>

## <a id="features"></a>Features

<div align="center">

### Core Capabilities

</div>

<br/>

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🤖 AI Financial Analysis</h3>
      <p>Advanced AI that analyzes your spending patterns, detects inefficiencies, and provides personalized recommendations to optimize your finances.</p>
      <ul>
        <li>Real-time spending categorization</li>
        <li>Anomaly detection for unusual transactions</li>
        <li>Predictive budgeting based on historical data</li>
        <li>Risk assessment for your investment portfolio</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>📊 Smart Dashboard</h3>
      <p>A beautiful, interactive dashboard that gives you a complete overview of your financial health at a glance.</p>
      <ul>
        <li>Real-time balance tracking</li>
        <li>Animated charts and visualizations (Recharts)</li>
        <li>Income vs. expense breakdown</li>
        <li>Customizable widgets and layout</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🎯 Goal Tracking</h3>
      <p>Set, track, and achieve your financial goals with visual progress indicators and smart milestones.</p>
      <ul>
        <li>Multiple goal types (emergency fund, travel, savings)</li>
        <li>Progress bars with percentage completion</li>
        <li>Estimated completion date projections</li>
        <li>AI-powered goal optimization suggestions</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>⚡ Smart Alerts</h3>
      <p>Proactive notifications that keep you informed about important changes in your financial landscape.</p>
      <ul>
        <li>Duplicate transaction detection</li>
        <li>Budget limit warnings (80%, 90%, 100%)</li>
        <li>Unusual spending pattern alerts</li>
        <li>Goal milestone celebrations</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🔐 Secure Authentication</h3>
      <p>Enterprise-grade authentication powered by Supabase, with session management and idle timeout protection.</p>
      <ul>
        <li>Email/password authentication</li>
        <li>Social login providers (configured via Supabase)</li>
        <li>Automatic session idle timeout (30 min)</li>
        <li>Protected routes with middleware</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🌐 Multi-language Support</h3>
      <p>Fully internationalized interface with seamless language switching between Spanish and English.</p>
      <ul>
        <li>Complete i18n coverage (UI, forms, alerts)</li>
        <li>Browser language auto-detection</li>
        <li>Instant switching without page reload</li>
        <li>Extensible for additional languages</li>
      </ul>
    </td>
  </tr>
</table>

<br/>

### Visual & Experience Highlights

<div align="center">
  <table>
    <tr>
      <td align="center">🎨 <strong>Dark-first Design</strong><br/><sub>Premium dark interface with custom gradient system</sub></td>
      <td align="center">🔄 <strong>Fluid Animations</strong><br/><sub>Powered by Motion (Framer Motion API)</sub></td>
      <td align="center">📱 <strong>Fully Responsive</strong><br/><sub>Mobile-first, adaptive layouts</sub></td>
      <td align="center">⚡ <strong>SSR + Streaming</strong><br/><sub>TanStack Start server rendering</sub></td>
    </tr>
    <tr>
      <td align="center">🧩 <strong>Component Library</strong><br/><sub>shadcn/ui + 30+ Radix primitives</sub></td>
      <td align="center">📝 <strong>Form Validation</strong><br/><sub>React Hook Form + Zod schemas</sub></td>
      <td align="center">🔔 <strong>Toast Notifications</strong><br/><sub>Sonner beautiful toasts</sub></td>
      <td align="center">🧹 <strong>Clean Code</strong><br/><sub>ESLint + Prettier + TypeScript strict</sub></td>
    </tr>
  </table>
</div>

<br/>

---

<br/>

## <a id="tech-stack"></a>Tech Stack

<div align="center">

| Layer | Technology | Badge |
|-------|-----------|-------|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19) | ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) |
| **Routing** | [TanStack Router](https://tanstack.com/router) v1 | ![TanStack](https://img.shields.io/badge/TanStack_Router-FF4154?logo=react-router) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) | ![Tailwind](https://img.shields.io/badge/Tailwind_v4-38B2AC?logo=tailwindcss) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com) (30+ components) | ![Radix](https://img.shields.io/badge/Radix_UI-000000?logo=radixui) |
| **Backend / Auth** | [Supabase](https://supabase.com) | ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase) |
| **Animation** | [Motion](https://motion.dev) | ![Motion](https://img.shields.io/badge/Motion-0055FF?logo=framer) |
| **Forms / Validation** | React Hook Form + [Zod](https://zod.dev) | ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod) |
| **Internationalization** | [react-i18next](https://react.i18next.com) | ![i18n](https://img.shields.io/badge/i18next-26A69A?logo=i18next) |
| **Charts** | [Recharts](https://recharts.org) | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?logo=recharts) |
| **Bundler** | [Vite](https://vitejs.dev) v7 | ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite) |
| **Language** | [TypeScript](https://www.typescriptlang.org) v5.8 | ![TS](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript) |
| **Linting** | ESLint + Prettier | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint) |

</div>

<br/>

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `@tanstack/react-query` | Server state management & caching |
| `@tanstack/react-router` | File-based routing with SSR support |
| `@tanstack/react-start` | TanStack SSR framework |
| `@supabase/supabase-js` | Database, auth, and realtime subscriptions |
| `motion` | Declarative animations & gesture handling |
| `clsx` + `tailwind-merge` | Conditional class merging |
| `class-variance-authority` | Component variant management |
| `lucide-react` | Consistent, beautiful icon set |
| `date-fns` | Modern date utility library |
| `sonner` | Toast notifications |
| `embla-carousel-react` | Touch-optimized carousels |
| `react-markdown` | Markdown rendering |
| `vaul` | Drawer component |

<br/>

---

<br/>

## <a id="getting-started"></a>Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10 or **bun** >= 1.0
- A **Supabase** account (free tier works perfectly)
- Basic familiarity with TypeScript and React

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/t1nv/breezkit.git
cd breezkit

# 2. Install dependencies (npm or bun)
npm install
# or
bun install

# 3. Set up environment variables
cp .env.example .env
```

```env
# Required — Supabase credentials
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```

```bash
# 4. Start the development server
npm run dev
```

The app will be available at **`http://localhost:3000`**.

### Build for Production

```bash
# Production build
npm run build

# Preview the production build locally
npm run preview
```

### Linting & Formatting

```bash
# Lint all files
npm run lint

# Auto-format with Prettier
npm run format
```

<br/>

---

<br/>

## <a id="project-structure"></a>Project Structure

```
breezkit/
├── public/                     # Static assets (images, fonts)
│
├── src/
│   ├── assets/                 # Imported assets (images, SVGs)
│   │   └── dashboard-preview.jpg
│   │
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   └── landing/            # Landing page sections
│   │       ├── how-it-works.tsx
│   │       ├── security.tsx
│   │       ├── use-cases.tsx
│   │       ├── comparison.tsx
│   │       ├── integrations.tsx
│   │       └── dashboard-preview.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │
│   ├── integrations/           # Third-party service clients
│   │   └── supabase/
│   │       └── client.ts       # Supabase client instance
│   │
│   ├── lib/                    # Utilities and configuration
│   │   ├── i18n/               # Internationalization
│   │   │   ├── index.ts
│   │   │   ├── en.ts           # English translations
│   │   │   └── es.ts           # Spanish translations
│   │   ├── utils.ts            # General utilities
│   │   └── ...
│   │
│   ├── routes/                 # TanStack Router file-based routes
│   │   ├── __root.tsx          # Root layout
│   │   ├── index.tsx           # Landing page
│   │   ├── auth.tsx            # Authentication page
│   │   ├── _authenticated.tsx  # Auth guard layout
│   │   └── _authenticated/     # Protected routes
│   │       └── dashboard.tsx   # Main dashboard
│   │
│   ├── router.tsx              # Router configuration
│   ├── routeTree.gen.ts        # Auto-generated route tree
│   ├── server.ts               # Server entry point
│   ├── start.ts                # Application bootstrap
│   └── styles.css              # Global styles + Tailwind import
│
├── supabase/                   # Supabase configuration
│   └── migrations/             # Database migrations
│
├── .env.example                # Environment variable template
├── .gitignore
├── .prettierrc                 # Prettier configuration
├── bunfig.toml                 # Bun configuration
├── components.json             # shadcn/ui configuration
├── eslint.config.js            # ESLint flat config
├── package.json
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite + TanStack configuration
└── README.md                   # This file
```

<br/>

---

<br/>

## <a id="configuration"></a>Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_PROJECT_ID` | Yes | Supabase project identifier |
| `VITE_SUPABASE_URL` | Yes | Exposed to client (should match SUPABASE_URL) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Exposed to client |
| `VITE_SUPABASE_PROJECT_ID` | Yes | Exposed to client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Admin operations (keep secret!) |
| `LOVABLE_API_KEY` | Server-only | AI chat features (optional) |
| `DISABLE_RATE_LIMITER` | Dev only | Set to `"true"` to bypass rate limiting |

<br/>

---

<br/>

## <a id="license"></a>License

This project is **proprietary software**. All rights reserved.

<br/>

---

<br/>

<div align="center">
  <table style="border-collapse: collapse; border: none;">
    <tr>
      <td style="border: none; text-align: center;">
        <p style="font-size: 0.9rem; color: #666;">
          Built with
          ❤️
          and TypeScript
        </p>
        <p style="font-size: 0.8rem; color: #555;">
          &copy; 2026 <a href="https://github.com/t1nv">t1nv</a> &middot;
          <a href="https://github.com/t1nv/breezkit">Breezkit</a>
        </p>
        <br/>
        <p style="font-size: 0.8rem; color: #444;">
          <a href="#overview">Back to top ↑</a>
        </p>
      </td>
    </tr>
  </table>
</div>
