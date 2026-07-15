# BizTrack — Personal Business Manager

A modern, dark-glass React app for running a personal network-marketing business —
customers, partners/downline, activities, purchases, and goals — backed by a custom
ServiceNow scoped app.

**Live:** https://yapseng98.github.io/personal_business/
**Try it now:** click **“Explore the demo”** on the login screen — it runs entirely
in-memory with sample data, no ServiceNow account needed.

## Features

- **Dashboard** — overview stats, monthly revenue chart, and upcoming activities
- **Customers** — customer master with contact details plus per-customer purchase history
- **Purchases** — track orders with product, amount, date, and status
- **Partners** — your downline network with sponsor/upline relationships, an interactive
  org **tree view**, account type (ABO/ABC), interest tags, and one-tap **WhatsApp** contact
- **Activities** — month **calendar** with iOS-style event chips, a map of activity
  locations, all-day/timed events, **WhatsApp invites** to partners, and **bulk upload**
  from a spreadsheet
- **Goals** — set targets and track progress
- **Products** — product catalog reference
- **Demo mode** — explore the whole app with realistic sample data, offline

## Tech Stack

- Vite + React 18 + TypeScript
- Tailwind CSS (custom dark-glass theme)
- TanStack React Query · React Router (HashRouter)
- Recharts (charts) · Leaflet / react-leaflet (activity map)
- @xyflow/react + @dagrejs/dagre (partner org tree)
- xlsx (bulk activity upload) · axios · lucide-react
- ServiceNow custom scoped app (token-based Auth API)

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173/personal_business/
```

On the login screen you can either **register / log in** against the ServiceNow
backend, or click **“Explore the demo”** to run with the in-memory sample backend.

### Build & Deploy

```bash
npm run build      # type-checks, then builds to docs/
```

The site is hosted on **GitHub Pages** from the `docs/` folder on `main`
(Vite `base` is `/personal_business/`). Pushing an updated `docs/` build to `main`
publishes it. `touch docs/.nojekyll` after building so Pages serves the assets as-is.

## Backend (ServiceNow)

BizTrack talks to a **custom scoped application** (`x_887486_biztrack`), not the stock
Table API. Requests go to `https://<instance>/api/x_887486_biztrack/biztrack`, and auth
is a **custom token API** (register / login / logout) — the session token is sent in the
`X-BizTrack-Token` header. In dev, Vite proxies `/snow-api` → the instance
(see [`vite.config.ts`](vite.config.ts)).

Core tables: `u_customer_master`, `u_customer_purchase`, `u_business_goal`,
`u_partner`, `u_activity`, `u_partner_activity`. Records are owner/downline scoped;
activities are shared across users.

Setup and integration details live in:

- [`SN_SETUP.md`](SN_SETUP.md) — table and field setup
- [`BIZTRACK_INTEGRATION_GUIDE.md`](BIZTRACK_INTEGRATION_GUIDE.md) — the Auth API and integration
- [`SYSTEM_DESIGN.md`](SYSTEM_DESIGN.md) — architecture overview
- [`servicenow/`](servicenow/) — the Script Include and REST resources
