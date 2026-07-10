# ServiceNow Setup Guide — BizTrack

Everything you must configure in `dev405150.service-now.com` for the app to work.
Field names, choice values, and reference targets below are taken **directly from the code** — they must match exactly (the app sends these literal strings).

---

## Current status (updated)

- **The 6 tables already exist** in the scoped application **`x_887486_biztrack`**, named exactly `u_customer_master`, `u_customer_purchase`, `u_business_goal`, `u_partner`, `u_activity`, `u_partner_activity`.
- Because the table **Names** are `u_*`, the app matches them as-is — **no code change needed for table names**, even though they live in a scope. The Table API addresses tables by Name, not by scope.
- The app's **login screen is enabled** — it collects your ServiceNow username + password, which every data request uses. Without signing in, all pages stay empty by design.

So the remaining work is **integration access + CORS + a sign-in user**, below. The field/choice spec further down is now a **verification reference**, not a build list.

---

## 0. Rules that still matter

1. **Choice values are case-sensitive and exact.** The app stores the raw value (e.g. `cross_line`, `not_interested`, `bulk_upload`). If a choice value differs by even a capital letter, that record breaks.
2. **Column names must be `u_*`** to match the code (`u_name`, `u_status`, …). Your table *names* are already `u_*`; confirm the *columns* are too (open a table → Table Columns).

---

## 1. Integration setup (do these to make it work)

### 1a. ⭐ Table Application Access — the scoped-app step (all 6 tables)
Because the tables live in the `x_887486_biztrack` scope, an outside REST call is **blocked by default** — you get `403` even with a correct login. Fix per table.

*ServiceNow Studio → open each Table → "Application Access" section:*
- ✅ **Can read**, **Can create**, **Can update**, **Can delete**
- ✅ **Allow access to this table via web services**
- **Accessible from** → **All application scopes** (not "This application scope only")

Apply to all six: `u_customer_master`, `u_customer_purchase`, `u_business_goal`, `u_partner`, `u_activity`, `u_partner_activity`.
**This is the #1 reason a scoped-app REST integration returns empty / 403.**

### 1b. CORS rule (REQUIRED — the app calls SN from the browser)
*System Web Services → REST → CORS Rules → New*
- **Name**: BizTrack GitHub Pages
- **REST API**: Table API `now/table` (`/api/now/table`)
- **Domain**: `https://yapseng98.github.io`
- **HTTP Methods**: GET, POST, PATCH, DELETE

Without this, the browser blocks every request and all pages stay empty even with correct tables.

### 1c. Sign-in user (Basic auth)
The app authenticates with a ServiceNow **username + password** on every request, so:
- Use a **local** user that has a password (not SSO-only). On dev, your `admin` account works.
- The user must satisfy the tables' ACLs. The scoped app auto-generated ~48 Access Controls + 2 roles. Simplest: sign in as **admin** (passes all ACLs). Otherwise grant the user the app's 2 roles and confirm those ACLs allow read/create/update/delete.

---

## 2. Field reference — Customers / Purchases / Goals

You've already built these. Use the tables below to **verify** the columns match; the app reads/writes exactly these `u_*` names.

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

## 3. Field reference — Partners / Activities / Junction

Also already built. Verify columns and choice values against these. (If you ever rebuild from scratch, create them in this order — `u_partner` → `u_activity` → `u_partner_activity` — because of the reference dependencies.)

### `u_partner` (Partners / team network)

Plain fields plus three Reference fields (`u_sponsor`/`u_partner_of` point at `u_partner` itself; `u_customer` points at `u_customer_master`).

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

### `u_activity` (Events)

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

### `u_partner_activity` (junction: invitations & RSVP)

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

0. **Open the live app and sign in** — the login screen collects your ServiceNow username + password (instance `dev405150.service-now.com` is pre-filled). If sign-in fails, it's CORS (§1b) or the user/password (§1c).
1. **Add a Partner** → refresh → it persists ⇒ `u_partner` + Application Access + CORS + auth all good.
2. **Convert a Customer to Partner** (Customer detail page) → new partner appears with a "Converted from customer" link ⇒ `u_customer` reference works.
3. **Add an Activity with an address** → map renders after a moment ⇒ `u_activity` + geocoding good.
4. **Invite a partner to the activity and confirm them** ⇒ `u_partner_activity` good.

**If pages are empty / you get errors:** open the browser console. A **CORS** error → §1b. A **403 / Forbidden** → §1a Application Access (the scoped-app step). A **401** → §1c sign-in user.

---

## What's left for you (checklist)

| Item | Where | Status |
|---|---|---|
| 6 tables named `u_*` in scope `x_887486_biztrack` | ServiceNow | ✅ done |
| App login enabled (collects credentials) | code | ✅ done |
| Table **Application Access** — all scopes + web services, ×6 | §1a | ⬜ **most important** |
| CORS rule for `https://yapseng98.github.io` | §1b | ⬜ |
| Sign-in user with password + admin/role | §1c | ⬜ |
| Confirm columns are `u_*` | §0 | ⬜ quick check |

## Quick reference — all six tables

| Table | Purpose |
|---|---|
| u_customer_master | Customers (buyers) |
| u_customer_purchase | Orders |
| u_business_goal | Goals |
| u_partner | Team network |
| u_activity | Events |
| u_partner_activity | Invite/RSVP junction |

**Reference fields (6):**
`u_customer_purchase.u_customer→u_customer_master` ·
`u_partner.u_sponsor→u_partner` ·
`u_partner.u_partner_of→u_partner` ·
`u_partner.u_customer→u_customer_master` ·
`u_partner_activity.u_partner→u_partner` ·
`u_partner_activity.u_activity→u_activity`
