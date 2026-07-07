# ServiceNow Setup Guide — BizTrack

Everything you must configure in `dev405150.service-now.com` for the app to work.
Field names, choice values, and reference targets below are taken **directly from the code** — they must match exactly (the app sends these literal strings).

---

## 0. Before you create anything — 3 rules

1. **Global scope only.** Create every table in the **Global** application scope so it is named exactly `u_activity`, `u_partner`, etc. A scoped app would rename them `x_yourscope_activity` and the app would not find them.
2. **Choice values are case-sensitive and exact.** The app stores the raw value (e.g. `cross_line`, `not_interested`, `bulk_upload`). If your choice value differs by even a capital letter, that record breaks.
3. **Create tables in the order below.** Reference fields can only point at tables that already exist, and two tables reference themselves.

---

## 1. Instance-level setup (one time)

### 1a. CORS rule (REQUIRED — the app calls SN from the browser)
*System Web Services → REST → CORS Rules → New*
- **Name**: BizTrack GitHub Pages
- **REST API**: Table API `now/table` (`/api/now/table`)
- **Domain**: `https://yapseng98.github.io`
- **HTTP Methods**: GET, POST, PATCH, DELETE

Without this, the browser blocks every request and all pages stay empty even with correct tables.

### 1b. API user / role
The username + password you sign in with must have **read + write + create + delete** on all six tables below. On a personal dev instance the `admin` role covers this. If you use a dedicated integration user, grant it those ACLs.

---

## 2. Existing tables (should already exist — verify fields)

These three power Customers / Purchases / Goals and were built earlier. Confirm they exist with these fields; **the only genuinely new change here is the `u_customer` field is NOT on these — it is added to `u_partner` in §3.**

### `u_customer_master` — Customers
| Field | Type |
|---|---|
| u_name | String |
| u_email | String |
| u_phone | String |
| u_company | String |
| u_address | String (multi-line) |
| u_notes | String (multi-line) |

### `u_customer_purchase` — Orders
| Field | Type | Notes |
|---|---|---|
| u_customer | **Reference → u_customer_master** | |
| u_product_name | String | |
| u_amount | String (or Decimal) | app parses as number |
| u_purchase_date | Date | |
| u_notes | String | |
| u_status | **Choice** | `pending`, `completed`, `cancelled` |

### `u_business_goal` — Goals
| Field | Type | Notes |
|---|---|---|
| u_title | String | |
| u_description | String (multi-line) | |
| u_target_value | String (or Decimal) | |
| u_current_value | String (or Decimal) | |
| u_unit | String | |
| u_deadline | Date | |
| u_category | String | free text (not a choice) |
| u_status | **Choice** | `active`, `completed`, `paused` |

---

## 3. NEW tables to create (in this order)

### STEP 1 — Create `u_partner` (Partners / team network)

Create the table first with the plain fields, **then** add the three Reference fields (they need `u_partner` and `u_customer_master` to already exist — self-references are added after the table is created).

| Field | Type | Choice values / reference target |
|---|---|---|
| u_name | String | |
| u_email | String | |
| u_phone | String | |
| u_rank | String | free text (app supplies the dropdown) |
| u_interest_tags | String | comma-separated |
| u_notes | String (multi-line) | |
| u_status | **Choice** | `active`, `inactive`, `prospect` |
| u_network_position | **Choice** | `upline`, `downline`, `cross_line`, `prospect` |
| u_sponsor | **Reference → u_partner** (itself) | empty = "Unassigned" |
| u_partner_of | **Reference → u_partner** (itself) | lateral link (e.g. spouse) |
| u_customer | **Reference → u_customer_master** | set when a customer is converted |

### STEP 2 — Create `u_activity` (Events)

| Field | Type | Choice values |
|---|---|---|
| u_title | String | |
| u_description | String (multi-line) | |
| u_tags | String | comma-separated |
| u_address | String | |
| u_lat | String | |
| u_lng | String | |
| u_activity_date | Date | |
| u_activity_time | String | app sends `HH:MM` |
| u_category | **Choice** | `Meeting`, `Training`, `Product Launch`, `Recruiting`, `Social`, `Recognition`, `Other` |
| u_geocode_status | **Choice** | `pending`, `success`, `failed`, `manual` |
| u_status | **Choice** | `planned`, `confirmed`, `completed`, `cancelled` |
| u_source | **Choice** | `manual`, `bulk_upload` |

> Note: `u_category` here uses **Proper Case** values (`Meeting`) — the one exception to the lowercase rule, because the Excel importer matches against them directly.

### STEP 3 — Create `u_partner_activity` (junction: invitations & RSVP)

Create last — both reference fields need `u_partner` and `u_activity` to exist.

| Field | Type | Choice values / reference target |
|---|---|---|
| u_partner | **Reference → u_partner** | |
| u_activity | **Reference → u_activity** | |
| u_role_in_activity | String | free text (Attendee / Speaker / …) |
| u_interested | **Choice** | `interested`, `not_interested`, `unknown` |
| u_confirmed | **Choice** | `confirmed`, `declined`, `pending` |

---

## 4. Why the reference targets need `u_name` / `u_title`

The app "dot-walks" to show display names. These already exist, nothing extra to do — just don't rename them:
- `u_partner.u_sponsor` → reads `u_sponsor.u_name`
- `u_partner.u_partner_of` → reads `u_partner_of.u_name`
- `u_partner.u_customer` → reads `u_customer.u_name`
- `u_partner_activity.u_partner` → reads `u_partner.u_name`
- `u_partner_activity.u_activity` → reads `u_activity.u_title`

---

## 5. Verify it works (in the live app)

1. **Add a Partner** → refresh → it persists ⇒ `u_partner` + CORS + auth all good.
2. **Convert a Customer to Partner** (Customer detail page) → new partner appears with a "Converted from customer" link ⇒ `u_customer` reference works.
3. **Add an Activity with an address** → map renders after a moment ⇒ `u_activity` + geocoding good.
4. **Invite a partner to the activity and confirm them** ⇒ `u_partner_activity` good.

---

## Quick reference — all six tables

| Table | Purpose | New? |
|---|---|---|
| u_customer_master | Customers (buyers) | existing |
| u_customer_purchase | Orders | existing |
| u_business_goal | Goals | existing |
| **u_partner** | Team network | **new** |
| **u_activity** | Events | **new** |
| **u_partner_activity** | Invite/RSVP junction | **new** |

**Reference fields (6):**
`u_customer_purchase.u_customer→u_customer_master` ·
`u_partner.u_sponsor→u_partner` ·
`u_partner.u_partner_of→u_partner` ·
`u_partner.u_customer→u_customer_master` ·
`u_partner_activity.u_partner→u_partner` ·
`u_partner_activity.u_activity→u_activity`
