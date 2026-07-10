# BizTrack — ServiceNow Integration Guide

BizTrack now uses a **custom Auth API** (like Personal-Money-Tracker) instead of Basic auth:
users create **app accounts**, sign in for a **token**, and every data call goes through a
**Scripted REST API** in your scoped app. No ServiceNow credentials ever touch the browser.

- **Scope:** `x_887486_biztrack`
- **API base URL:** `https://<instance>/api/x_887486_biztrack/biztrack`
- **Code to paste** lives in the repo's `servicenow/` folder.

Because the API runs **inside your scope** and uses server-side `GlideRecord`, you do **not**
need the old "Application Access / all scopes" or a Basic-auth admin user. The only instance
setting required is one **CORS rule** for the browser.

---

## Phase 1 — Two auth tables

Create these in the `x_887486_biztrack` scope (same as your other `u_*` tables).

### `u_app_user`
| Column | Type | Notes |
|---|---|---|
| u_username | String (100) | app login name |
| u_password_hash | String (100) | SHA-256 hex |
| u_salt | String (100) | per-user salt |
| u_display_name | String (100) | |
| u_email | String (100) | |
| u_active | True/False | default **true** |
| u_last_login | Date/Time | |

### `u_app_session`
| Column | Type | Notes |
|---|---|---|
| u_user | **Reference → u_app_user** | |
| u_token | String (100) | session token |
| u_expires_at | Date/Time | 7-day expiry |
| u_device_hint | String (255) | optional |

*(Your 6 data tables — `u_customer_master`, `u_customer_purchase`, `u_business_goal`, `u_partner`, `u_activity`, `u_partner_activity` — already exist. Nothing to change on them.)*

---

## Phase 2 — Script Include

`Studio → Create File → Server Development → Script Include`
- **Name:** `BizTrackAuth`
- **Client callable:** No · **Accessible from:** All application scopes
- **Script:** paste all of `servicenow/SI_BizTrackAuth.js`

This holds password hashing, token sessions, token validation, and the generic table read/write used by the API.

---

## Phase 3 — Scripted REST API + 5 resources

`All → System Web Services → Scripted REST APIs → New`
- **Name:** `BizTrack API`
- **API ID:** `biztrack`  (gives base path `/api/x_887486_biztrack/biztrack`)

Then add **5 resources** (New on the API). For **every** resource set
**Requires authentication = false** and leave **Requires ACL** empty. Paste the matching
block from `servicenow/REST_BizTrackAPI_resources.js`:

| # | HTTP method | Relative path | Purpose |
|---|---|---|---|
| 1 | POST | `/auth/{action}` | login / register / logout |
| 2 | GET | `/data/{table}` | list records |
| 3 | GET | `/data/{table}/{id}` | one record |
| 4 | POST | `/data/{table}` | create |
| 5 | POST | `/data/{table}/{id}` | update / delete (via `X-HTTP-Method`) |

> Why "Requires authentication = false": the browser has no ServiceNow login — our own
> token (checked inside each resource) is the guard. Server-side `GlideRecord` runs regardless
> of table ACLs, so the API reaches your data safely.

---

## Phase 4 — One CORS rule (for the browser)

The app calls the API from `https://yapseng98.github.io` with a JSON body and custom headers,
so the browser sends a CORS preflight. Allow it:

`All → System Web Services → REST → CORS Rules → New`
- **Name:** BizTrack API
- **REST API:** `BizTrack API` (the one you just made)
- **Domain:** `https://yapseng98.github.io`
- **HTTP Methods:** GET, POST, OPTIONS

*(In local dev the app is proxied same-origin, so this rule only matters for the live site.)*

---

## Phase 5 — Test end-to-end

1. Open the live app → the **Modern-Fintech login** appears.
2. Click **Create one** → register a username + password (min 6 chars). You should land on the Dashboard signed in.
3. Sign out → sign back in with the same details.
4. Add a Customer / Partner → it saves ⇒ the token + data proxy work.

**If it fails, open the browser console:**
- **CORS error** → Phase 4 (the CORS rule or its domain).
- **401 "Not signed in"** on data calls → the token wasn't accepted; re-check the Script Include name (`BizTrackAuth`) and that resources have Requires-auth = false.
- **404** on `/auth/login` → the API ID isn't `biztrack`, or the resource path/method is off.

---

## How it fits together

```
Browser (GitHub Pages)
   │  POST /biztrack/auth/login  {username,password}
   ▼
BizTrack API (Scripted REST, Requires auth = false)
   │  BizTrackAuth.login() → SHA-256 check → create u_app_session → { token, user }
   ▼
Browser stores token, then for every data call:
   GET/POST /biztrack/data/{table}   header: X-BizTrack-Token
   │  BizTrackAuth.userForToken(token) guards it → GlideRecord on u_* tables
   ▼
{ result: … }  ← same shape the app already expects
```

Reference architecture: `YapSeng98/Personal-Money-Tracker` (PFMT Auth API).
