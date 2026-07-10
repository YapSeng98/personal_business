import axios from 'axios'
import type { Customer, CustomerPurchase, BusinessGoal, SNCredentials, Activity, Partner, PartnerActivity, AppUser } from '../types'

const TABLES = {
  CUSTOMER: 'u_customer_master',
  PURCHASE: 'u_customer_purchase',
  GOAL: 'u_business_goal',
  ACTIVITY: 'u_activity',
  PARTNER: 'u_partner',
  PARTNER_ACTIVITY: 'u_partner_activity',
}

// ── BizTrack Scripted REST API ────────────────────────────────────────────
// Base: https://<instance>/api/x_887486_biztrack/biztrack
// In dev, Vite proxies /snow-api → the instance (see vite.config.ts).
function apiBase(instance: string): string {
  return import.meta.env.DEV ? '/snow-api/api/x_887486_biztrack/biztrack' : `https://${instance}/api/x_887486_biztrack/biztrack`
}

function apiError(e: unknown): string {
  const err = e as { response?: { data?: { result?: { error?: string }; error?: string } }; message?: string }
  return err?.response?.data?.result?.error || err?.response?.data?.error || err?.message || 'Request failed'
}

// Auth calls need no token. Every request is HTTP GET or POST; the real
// verb rides in X-HTTP-Method so PATCH/DELETE tunnel through POST (avoids
// SN's body restrictions on those verbs and keeps CORS simple).
export async function authLogin(instance: string, username: string, password: string): Promise<{ token: string; user: AppUser }> {
  try {
    const res = await axios.post(`${apiBase(instance)}/auth/login`, { username, password }, {
      headers: { 'Content-Type': 'application/json', 'X-HTTP-Method': 'POST' },
    })
    return res.data?.result ?? res.data
  } catch (e) { throw new Error(apiError(e)) }
}

export async function authRegister(
  instance: string,
  data: { username: string; password: string; display_name: string; email: string }
): Promise<{ token: string; user: AppUser }> {
  try {
    const res = await axios.post(`${apiBase(instance)}/auth/register`, data, {
      headers: { 'Content-Type': 'application/json', 'X-HTTP-Method': 'POST' },
    })
    return res.data?.result ?? res.data
  } catch (e) { throw new Error(apiError(e)) }
}

export async function authLogout(instance: string, token: string): Promise<void> {
  try {
    await axios.post(`${apiBase(instance)}/auth/logout`, {}, {
      headers: { 'Content-Type': 'application/json', 'X-HTTP-Method': 'POST', 'X-BizTrack-Token': token },
    })
  } catch { /* best effort */ }
}

// Data client. Keeps the existing Table-API call shape used by every
// service function below and transparently rewrites it to the BizTrack
// /data proxy, mapping params and tunnelling the verb through POST.
function createClient(creds: SNCredentials) {
  const client = axios.create({
    baseURL: apiBase(creds.instance),
    headers: { 'Content-Type': 'application/json', 'X-BizTrack-Token': creds.token },
  })
  client.interceptors.request.use(cfg => {
    const m = (cfg.url || '').match(/^\/api\/now\/table\/([^/]+)(?:\/(.+))?$/)
    if (m) {
      const table = m[1]
      const id = m[2]
      const method = (cfg.method || 'get').toUpperCase()
      if (cfg.params) {
        const p: Record<string, unknown> = {}
        const src = cfg.params as Record<string, unknown>
        if (src.sysparm_fields) p.fields = src.sysparm_fields
        if (src.sysparm_query) p.query = src.sysparm_query
        if (src.sysparm_order_by) p.order_by = src.sysparm_order_by
        if (src.sysparm_order_by_desc) p.order_desc = src.sysparm_order_by_desc
        if (src.sysparm_limit) p.limit = src.sysparm_limit
        cfg.params = p
      }
      if (method === 'GET') {
        cfg.url = `/data/${table}${id ? '/' + id : ''}`
      } else {
        cfg.headers.set('X-HTTP-Method', method)
        cfg.method = 'post'
        cfg.url = id ? `/data/${table}/${id}` : `/data/${table}`
      }
    }
    return cfg
  })
  // Normalize the response so callers can always read `res.data.result`,
  // regardless of how ServiceNow wraps the Scripted REST body.
  client.interceptors.response.use(res => {
    if (res.data && typeof res.data === 'object' && !('result' in res.data)) {
      res.data = { result: res.data }
    }
    return res
  })
  return client
}

// Customers
export async function getCustomers(creds: SNCredentials): Promise<Customer[]> {
  const client = createClient(creds)
  const res = await client.get(`/api/now/table/${TABLES.CUSTOMER}`, {
    params: {
      sysparm_fields: 'sys_id,u_name,u_email,u_phone,u_company,u_address,u_notes,sys_created_on,sys_updated_on',
      sysparm_order_by: 'u_name',
      sysparm_limit: 1000,
    },
  })
  return res.data.result
}

export async function getCustomer(creds: SNCredentials, sysId: string): Promise<Customer> {
  const client = createClient(creds)
  const res = await client.get(`/api/now/table/${TABLES.CUSTOMER}/${sysId}`)
  return res.data.result
}

export async function createCustomer(creds: SNCredentials, data: Partial<Customer>): Promise<Customer> {
  const client = createClient(creds)
  const res = await client.post(`/api/now/table/${TABLES.CUSTOMER}`, data)
  return res.data.result
}

export async function updateCustomer(creds: SNCredentials, sysId: string, data: Partial<Customer>): Promise<Customer> {
  const client = createClient(creds)
  const res = await client.patch(`/api/now/table/${TABLES.CUSTOMER}/${sysId}`, data)
  return res.data.result
}

export async function deleteCustomer(creds: SNCredentials, sysId: string): Promise<void> {
  const client = createClient(creds)
  await client.delete(`/api/now/table/${TABLES.CUSTOMER}/${sysId}`)
}

// Purchases
export async function getPurchases(creds: SNCredentials, customerSysId?: string): Promise<CustomerPurchase[]> {
  const client = createClient(creds)
  const params: Record<string, string | number> = {
    sysparm_fields: 'sys_id,u_customer,u_customer.u_name,u_product_name,u_amount,u_purchase_date,u_status,u_notes,sys_created_on',
    sysparm_order_by: 'u_purchase_date',
    sysparm_order_by_desc: 'true',
    sysparm_limit: 1000,
  }
  if (customerSysId) {
    params.sysparm_query = `u_customer=${customerSysId}`
  }
  const res = await client.get(`/api/now/table/${TABLES.PURCHASE}`, { params })
  return res.data.result.map((r: Record<string, unknown>) => ({
    ...r,
    u_customer: typeof r.u_customer === 'object' && r.u_customer !== null
      ? (r.u_customer as { value: string }).value
      : r.u_customer,
    u_customer_display: typeof r['u_customer.u_name'] === 'string' ? r['u_customer.u_name'] : '',
  }))
}

export async function createPurchase(creds: SNCredentials, data: Partial<CustomerPurchase>): Promise<CustomerPurchase> {
  const client = createClient(creds)
  const res = await client.post(`/api/now/table/${TABLES.PURCHASE}`, data)
  return res.data.result
}

export async function updatePurchase(creds: SNCredentials, sysId: string, data: Partial<CustomerPurchase>): Promise<CustomerPurchase> {
  const client = createClient(creds)
  const res = await client.patch(`/api/now/table/${TABLES.PURCHASE}/${sysId}`, data)
  return res.data.result
}

export async function deletePurchase(creds: SNCredentials, sysId: string): Promise<void> {
  const client = createClient(creds)
  await client.delete(`/api/now/table/${TABLES.PURCHASE}/${sysId}`)
}

// Goals
export async function getGoals(creds: SNCredentials): Promise<BusinessGoal[]> {
  const client = createClient(creds)
  const res = await client.get(`/api/now/table/${TABLES.GOAL}`, {
    params: {
      sysparm_fields: 'sys_id,u_title,u_description,u_target_value,u_current_value,u_unit,u_deadline,u_status,u_category,sys_created_on,sys_updated_on',
      sysparm_order_by: 'u_deadline',
      sysparm_limit: 500,
    },
  })
  return res.data.result
}

export async function createGoal(creds: SNCredentials, data: Partial<BusinessGoal>): Promise<BusinessGoal> {
  const client = createClient(creds)
  const res = await client.post(`/api/now/table/${TABLES.GOAL}`, data)
  return res.data.result
}

export async function updateGoal(creds: SNCredentials, sysId: string, data: Partial<BusinessGoal>): Promise<BusinessGoal> {
  const client = createClient(creds)
  const res = await client.patch(`/api/now/table/${TABLES.GOAL}/${sysId}`, data)
  return res.data.result
}

export async function deleteGoal(creds: SNCredentials, sysId: string): Promise<void> {
  const client = createClient(creds)
  await client.delete(`/api/now/table/${TABLES.GOAL}/${sysId}`)
}

// Activities
export async function getActivities(creds: SNCredentials): Promise<Activity[]> {
  const client = createClient(creds)
  const res = await client.get(`/api/now/table/${TABLES.ACTIVITY}`, {
    params: {
      sysparm_fields: 'sys_id,u_title,u_description,u_category,u_tags,u_activity_date,u_activity_time,u_address,u_lat,u_lng,u_geocode_status,u_status,u_source,sys_created_on,sys_updated_on',
      sysparm_order_by: 'u_activity_date',
      sysparm_limit: 1000,
    },
  })
  return res.data.result
}

export async function getActivity(creds: SNCredentials, sysId: string): Promise<Activity> {
  const client = createClient(creds)
  const res = await client.get(`/api/now/table/${TABLES.ACTIVITY}/${sysId}`)
  return res.data.result
}

export async function createActivity(creds: SNCredentials, data: Partial<Activity>): Promise<Activity> {
  const client = createClient(creds)
  const res = await client.post(`/api/now/table/${TABLES.ACTIVITY}`, data)
  return res.data.result
}

export async function updateActivity(creds: SNCredentials, sysId: string, data: Partial<Activity>): Promise<Activity> {
  const client = createClient(creds)
  const res = await client.patch(`/api/now/table/${TABLES.ACTIVITY}/${sysId}`, data)
  return res.data.result
}

export async function deleteActivity(creds: SNCredentials, sysId: string): Promise<void> {
  const client = createClient(creds)
  await client.delete(`/api/now/table/${TABLES.ACTIVITY}/${sysId}`)
}

// Partners
function normalizeRef(value: unknown): string {
  return typeof value === 'object' && value !== null ? (value as { value: string }).value : (value as string) ?? ''
}

export async function getPartners(creds: SNCredentials): Promise<Partner[]> {
  const client = createClient(creds)
  const res = await client.get(`/api/now/table/${TABLES.PARTNER}`, {
    params: {
      sysparm_fields: 'sys_id,u_name,u_email,u_phone,u_status,u_network_position,u_rank,u_sponsor,u_sponsor.u_name,u_partner_of,u_partner_of.u_name,u_customer,u_customer.u_name,u_interest_tags,u_notes,sys_created_on,sys_updated_on',
      sysparm_order_by: 'u_name',
      sysparm_limit: 1000,
    },
  })
  return res.data.result.map((r: Record<string, unknown>) => ({
    ...r,
    u_sponsor: normalizeRef(r.u_sponsor),
    u_sponsor_display: typeof r['u_sponsor.u_name'] === 'string' ? r['u_sponsor.u_name'] : '',
    u_partner_of: normalizeRef(r.u_partner_of),
    u_partner_of_display: typeof r['u_partner_of.u_name'] === 'string' ? r['u_partner_of.u_name'] : '',
    u_customer: normalizeRef(r.u_customer),
    u_customer_display: typeof r['u_customer.u_name'] === 'string' ? r['u_customer.u_name'] : '',
  }))
}

export async function getPartner(creds: SNCredentials, sysId: string): Promise<Partner> {
  const client = createClient(creds)
  const res = await client.get(`/api/now/table/${TABLES.PARTNER}/${sysId}`)
  return res.data.result
}

export async function createPartner(creds: SNCredentials, data: Partial<Partner>): Promise<Partner> {
  const client = createClient(creds)
  const res = await client.post(`/api/now/table/${TABLES.PARTNER}`, data)
  return res.data.result
}

export async function updatePartner(creds: SNCredentials, sysId: string, data: Partial<Partner>): Promise<Partner> {
  const client = createClient(creds)
  const res = await client.patch(`/api/now/table/${TABLES.PARTNER}/${sysId}`, data)
  return res.data.result
}

export async function deletePartner(creds: SNCredentials, sysId: string): Promise<void> {
  const client = createClient(creds)
  await client.delete(`/api/now/table/${TABLES.PARTNER}/${sysId}`)
}

// Partner ↔ Activity links
export async function getPartnerActivities(
  creds: SNCredentials,
  filter?: { partnerId?: string; activityId?: string }
): Promise<PartnerActivity[]> {
  const client = createClient(creds)
  const params: Record<string, string | number> = {
    sysparm_fields: 'sys_id,u_partner,u_partner.u_name,u_activity,u_activity.u_title,u_interested,u_confirmed,u_role_in_activity,sys_created_on',
    sysparm_limit: 1000,
  }
  const queryParts: string[] = []
  if (filter?.partnerId) queryParts.push(`u_partner=${filter.partnerId}`)
  if (filter?.activityId) queryParts.push(`u_activity=${filter.activityId}`)
  if (queryParts.length) params.sysparm_query = queryParts.join('^')

  const res = await client.get(`/api/now/table/${TABLES.PARTNER_ACTIVITY}`, { params })
  return res.data.result.map((r: Record<string, unknown>) => ({
    ...r,
    u_partner: normalizeRef(r.u_partner),
    u_partner_display: typeof r['u_partner.u_name'] === 'string' ? r['u_partner.u_name'] : '',
    u_activity: normalizeRef(r.u_activity),
    u_activity_display: typeof r['u_activity.u_title'] === 'string' ? r['u_activity.u_title'] : '',
  }))
}

export async function createPartnerActivity(creds: SNCredentials, data: Partial<PartnerActivity>): Promise<PartnerActivity> {
  const client = createClient(creds)
  const res = await client.post(`/api/now/table/${TABLES.PARTNER_ACTIVITY}`, data)
  return res.data.result
}

export async function updatePartnerActivity(creds: SNCredentials, sysId: string, data: Partial<PartnerActivity>): Promise<PartnerActivity> {
  const client = createClient(creds)
  const res = await client.patch(`/api/now/table/${TABLES.PARTNER_ACTIVITY}/${sysId}`, data)
  return res.data.result
}

export async function deletePartnerActivity(creds: SNCredentials, sysId: string): Promise<void> {
  const client = createClient(creds)
  await client.delete(`/api/now/table/${TABLES.PARTNER_ACTIVITY}/${sysId}`)
}

