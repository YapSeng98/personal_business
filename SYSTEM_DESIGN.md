# BizTrack — System Design & Structure

**Stack**: Vite + React 18 + TypeScript SPA · Tailwind CSS · TanStack React Query · React Router (HashRouter)
**Backend**: ServiceNow (instance `dev405150.service-now.com`) via REST Table API, Basic Auth
**Hosting**: GitHub Pages (static, `docs/` folder on `main`) — the browser calls ServiceNow directly; there is no app server.

## Architecture

```
Browser (React SPA on GitHub Pages)
   │
   ├── ServiceNow REST Table API  (all business data — CRUD on 6 custom tables)
   ├── Nominatim / OpenStreetMap  (address → lat/lng geocoding, free, rate-limited 1 req/s)
   └── OSM tile server            (map images via Leaflet)
```

- **Dev**: Vite proxies `/snow-api` → the ServiceNow instance (see `vite.config.ts`).
- **Prod**: `createClient()` in `src/services/servicenow.ts` calls `https://{instance}` directly.
- **Auth**: username/password held in `localStorage` (`biz_sn_creds`), sent as Basic Auth on every request. Login gate currently **disabled** via `AUTH_GATE_ENABLED = false` in `src/App.tsx`.

## ServiceNow data model (6 custom tables)

```
u_customer_master ──< u_customer_purchase          (customer's product orders)
        │
        │  u_customer (conversion link)
        ▼
     u_partner ──────< u_partner_activity >────── u_activity
        │ ▲                (junction: invite/RSVP)
        │ │ u_sponsor (tree hierarchy, self-ref)
        │ │ u_partner_of (lateral link, self-ref)
        └─┘
     u_business_goal                                (standalone)
```

### u_customer_master — Customers (product buyers)
| Field | Type |
|---|---|
| u_name, u_email, u_phone, u_company, u_address, u_notes | String |

### u_customer_purchase — Orders
| Field | Type |
|---|---|
| u_customer | **Reference → u_customer_master** |
| u_product_name, u_amount, u_purchase_date, u_notes | String |
| u_status | Choice: pending / completed / cancelled |

### u_business_goal — Goals
| Field | Type |
|---|---|
| u_title, u_description, u_target_value, u_current_value, u_unit, u_deadline, u_category | String |
| u_status | Choice: active / completed / paused |

### u_partner — Team network (Amway downline/upline)
| Field | Type |
|---|---|
| u_name, u_email, u_phone, u_rank, u_interest_tags, u_notes | String |
| u_status | Choice: active / inactive / prospect |
| u_network_position | Choice: upline / downline / cross_line / prospect |
| u_sponsor | **Reference → u_partner** (self; empty = "Unassigned") |
| u_partner_of | **Reference → u_partner** (self; lateral, e.g. spouse) |
| u_customer | **Reference → u_customer_master** (set when converted from a customer) |

### u_activity — Events
| Field | Type |
|---|---|
| u_title, u_description, u_tags, u_activity_date, u_activity_time, u_address, u_lat, u_lng | String |
| u_category | Choice: Meeting / Training / Product Launch / Recruiting / Social / Recognition / Other |
| u_geocode_status | Choice: pending / success / failed / manual |
| u_status | Choice: planned / confirmed / completed / cancelled |
| u_source | Choice: manual / bulk_upload |

### u_partner_activity — Junction (invitations & RSVP)
| Field | Type |
|---|---|
| u_partner | **Reference → u_partner** |
| u_activity | **Reference → u_activity** |
| u_interested | Choice: interested / not_interested / unknown |
| u_confirmed | Choice: confirmed / declined / pending |
| u_role_in_activity | String (Attendee / Speaker / Organizer / …) |

> **Setup note**: these tables must be created manually in ServiceNow (Table Designer / Studio).
> Create `u_partner` first, then add its two self-reference fields, then `u_partner_activity`.
> ACLs must allow the API user read/write on all six tables. Reference fields must be actual
> Reference-type columns so dot-walking (`u_sponsor.u_name` etc.) works.

## Customer → Partner conversion

A customer who joins the business is converted from the **Customer Detail** page:

1. `Convert to Partner` button copies name/email/phone/notes into a new `u_partner` record.
2. The new partner's `u_customer` field references the original customer — **both tables stay linked**.
3. New partner starts as `prospect` / unassigned (no sponsor) → appears in the Partners "Unassigned" tab for later placement in the tree.
4. Once converted, the customer page shows a green **Partner ✓** badge instead of the button (prevents duplicates), and the partner's detail panel shows a "Converted from customer" link back to the customer record with their full purchase history.

The customer record is **kept**, not deleted — partners can still buy products, so their order history continues to accrue on the customer side.

## Frontend structure

```
src/
├── App.tsx                     Routes + RequireAuth gate (AUTH_GATE_ENABLED flag)
├── contexts/AuthContext.tsx    Credentials in localStorage
├── services/
│   ├── servicenow.ts           All SN CRUD (TABLES const + per-entity functions)
│   └── geocoding.ts            Nominatim lookup, 1.1s throttle
├── lib/
│   ├── calendar.ts             Month-grid date math
│   ├── partnerMatching.ts      Tag-overlap scoring (activity ↔ partner interests)
│   ├── graphLayout.ts          Partner graph builder + dagre auto-layout
│   └── leafletIconFix.ts       Vite marker-icon patch
├── components/
│   ├── Layout/                 Sidebar (mobile drawer) + Header (hamburger) + Layout
│   └── ui/                     Modal, Badge, EmptyState, LoadingSpinner
├── pages/
│   ├── Dashboard.tsx           Stats, revenue chart, goals, recent orders
│   ├── Login.tsx               (bypassed while auth gate is off)
│   ├── customers/              List + Detail (orders, Convert-to-Partner) + forms
│   ├── purchases/              Order list + form
│   ├── goals/                  Goal cards + form
│   ├── products/               Static catalog (src/data/products.ts, no backend)
│   ├── activities/             Calendar, form, detail (map, suggestions, RSVP), bulk Excel upload
│   └── partners/               List (Unassigned tab), form, detail, React Flow tree
└── data/products.ts            21 Amway products (static)
```

**Menu order**: Dashboard → Activities → Customers → Partners → Purchases → My Goals → Products.

## Conventions

- All SN fields prefixed `u_`; every value typed as `string` (SN returns strings).
- Reference fields get a companion `*_display` populated via dot-walk (`sysparm_fields` includes `u_x.u_name`, post-processed in the service layer).
- Data queries: `useQuery({ queryKey, queryFn, enabled: !!credentials })`; mutations invalidate their query key.
- Detail views are right-side slide-over panels (state-driven, Esc/arrow-key nav), not routes.
- Currency `RM`, locale `en-MY`.

## Known limitations / notes

- Credentials in localStorage are readable by any JS on the page — acceptable for a personal tool, not for multi-user production.
- Nominatim throttle means bulk-uploading N activities takes ~N seconds for geocoding.
- Products page is static (no SN table) by design.
- Duplicate-conversion guard is client-side (checks loaded partners); SN itself doesn't enforce uniqueness on u_partner.u_customer.
- Bundle is ~1.6 MB minified (React Flow + Leaflet + xlsx); code-splitting is a future optimization.
