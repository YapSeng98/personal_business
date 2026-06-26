# BizTrack — Personal Business Manager

A modern React app for personal business management, backed by ServiceNow (dev405150.service-now.com).

## Features
- **Customer Master** — add, edit, delete customers with contact details
- **Purchase History** — track orders per customer with status and amounts
- **Personal Goals** — set and track business goals with progress bars
- **Dashboard** — overview stats and monthly revenue chart

## Tech Stack
- Vite + React 18 + TypeScript
- Tailwind CSS
- TanStack React Query
- Recharts
- ServiceNow Table REST API

## ServiceNow Setup

Create three custom tables in your ServiceNow instance (dev405150):

### 1. Customer Master — `u_customer_master`
| Field | Type |
|-------|------|
| u_name | String |
| u_email | String |
| u_phone | String |
| u_company | String |
| u_address | String |
| u_notes | String (max length) |

### 2. Customer Purchase — `u_customer_purchase`
| Field | Type |
|-------|------|
| u_customer | Reference → u_customer_master |
| u_product_name | String |
| u_amount | Decimal |
| u_purchase_date | Date |
| u_status | Choice (pending / completed / cancelled) |
| u_notes | String (max length) |

### 3. Business Goal — `u_business_goal`
| Field | Type |
|-------|------|
| u_title | String |
| u_description | String (max length) |
| u_target_value | Decimal |
| u_current_value | Decimal |
| u_unit | String |
| u_deadline | Date |
| u_status | Choice (active / completed / paused) |
| u_category | String |

## Getting Started

```bash
npm install
npm run dev
```

Login with your ServiceNow username and password. The app connects to `dev405150.service-now.com`.
