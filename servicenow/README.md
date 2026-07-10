# BizTrack — ServiceNow install (detailed steps)

Everything here is installed **inside your scoped app `x_887486_biztrack`**.
Files to paste live in this folder:

```
servicenow/
├── SI_BizTrackAuth.js              → the Script Include
└── rest-api/
    ├── Resource_1_auth.js          → POST /auth/{action}
    ├── Resource_2_data_list.js     → GET  /data/{table}
    ├── Resource_3_data_get.js      → GET  /data/{table}/{id}
    ├── Resource_4_data_create.js   → POST /data/{table}
    └── Resource_5_data_mutate.js   → POST /data/{table}/{id}
```

## What is stored in / fetched from ServiceNow

**All application data lives in ServiceNow** and is read back through the BizTrack API.
Nothing is kept in the browser except the session token.

| Data | ServiceNow table | Stored | Fetched |
|---|---|---|---|
| App accounts | `u_app_user` | ✅ | ✅ |
| Sessions / tokens | `u_app_session` | ✅ | ✅ |
| Customers | `u_customer_master` | ✅ | ✅ |
| Orders | `u_customer_purchase` | ✅ | ✅ |
| Goals | `u_business_goal` | ✅ | ✅ |
| Partners | `u_partner` | ✅ | ✅ |
| Activities | `u_activity` | ✅ | ✅ |
| Invitations / RSVP | `u_partner_activity` | ✅ | ✅ |
| Product catalog | *(static in the app — not in SN, by design)* | — | — |

Every create / read / update / delete for those tables goes **browser → BizTrack API → GlideRecord → table**, and back.

---

## STEP 1 · Create the two auth tables

`All → System Definition → Tables → New` (make sure the scope selector top-right is **BizTrack**).

**Table 1 — `u_app_user`** (Label: `App User`)

| Column name | Type | Max len / notes |
|---|---|---|
| u_username | String | 100 |
| u_password_hash | String | 100 |
| u_salt | String | 100 |
| u_display_name | String | 100 |
| u_email | String | 100 |
| u_active | True/False | default value **true** |
| u_last_login | Date/Time | |

**Table 2 — `u_app_session`** (Label: `App Session`)

| Column name | Type | Notes |
|---|---|---|
| u_user | Reference | Reference table = **u_app_user** |
| u_token | String | 100 |
| u_expires_at | Date/Time | |
| u_device_hint | String | 255 |

---

## STEP 2 · Create the Script Include

`Studio → your BizTrack app → Create File → Server Development → Script Include`

- **Name:** `BizTrackAuth`  *(must match exactly)*
- **Client callable:** unticked
- **Accessible from:** All application scopes
- **Active:** ticked
- **Script:** delete the template and paste **all of** `SI_BizTrackAuth.js`
- **Submit / Save**

---

## STEP 3 · Create the Scripted REST API

`All → System Web Services → Scripted REST APIs → New`

- **Name:** `BizTrack API`
- **API ID:** `biztrack`  *(type it — it lowercases automatically)*
- Confirm **Namespace** shows `x_887486_biztrack`.
  → Your base URL becomes: **`/api/x_887486_biztrack/biztrack`**
- **Submit**, then reopen the record so the **Resources** related list shows.

---

## STEP 4 · Add the 5 resources (one at a time)

On the **BizTrack API** record, scroll to the **Resources** related list → **New**.
Create these **five** resources. For **each one**:

1. Set **Name**, **HTTP method**, **Relative path** from the table below.
2. Open the **Security** tab → **untick "Requires authentication"**. Leave "Requires ACL authorization" empty.
3. In **Script**, paste the whole matching file.
4. **Submit.**

| # | Name | HTTP method | Relative path | Paste this file |
|---|---|---|---|---|
| 1 | Auth | **POST** | `/auth/{action}` | `rest-api/Resource_1_auth.js` |
| 2 | Data list | **GET** | `/data/{table}` | `rest-api/Resource_2_data_list.js` |
| 3 | Data get one | **GET** | `/data/{table}/{id}` | `rest-api/Resource_3_data_get.js` |
| 4 | Data create | **POST** | `/data/{table}` | `rest-api/Resource_4_data_create.js` |
| 5 | Data update/delete | **POST** | `/data/{table}/{id}` | `rest-api/Resource_5_data_mutate.js` |

> The `{action}`, `{table}`, `{id}` in braces are **path parameters** — type them exactly like that.
> Resources 4 and 5 are both **POST**; resource 5 decides update vs delete from the `X-HTTP-Method` header the app sends.

---

## STEP 5 · One CORS rule (for the live site only)

`All → System Web Services → REST → CORS Rules → New`

- **Name:** BizTrack API
- **REST API:** `BizTrack API`
- **Domain:** `https://yapseng98.github.io`
- **HTTP Methods:** tick **GET, POST, OPTIONS**

*(Local dev is proxied same-origin, so this only matters for the deployed site.)*

---

## STEP 6 · Test

1. Open the live app → **Create one** → register a username + password (min 6 chars).
2. You should land on the Dashboard, signed in.
3. Add a Customer or Partner → it saves ⇒ everything is wired.

**If something fails, open the browser console (F12 → Console):**

| Symptom | Fix |
|---|---|
| CORS / "blocked by CORS policy" | STEP 5 — the CORS rule or its Domain |
| 401 "Not signed in" on data calls | Script Include name must be `BizTrackAuth`; resources must have Requires-auth = false |
| 404 on `/auth/login` | API ID must be `biztrack`; check resource path + HTTP method |
| 500 | open the resource's script for a typo; check ServiceNow **System Log → Errors** |

---

## Quick self-test with REST API Explorer (optional)

`All → System Web Services → REST → REST API Explorer` → select **BizTrack API** →
resource **Auth** → method POST → path param `action = register` →
request body `{"username":"test","password":"secret1","display_name":"Test"}` → **Send**.
A `200` with a `token` means the API + Script Include + tables all work.
