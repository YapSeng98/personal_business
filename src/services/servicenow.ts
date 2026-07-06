import axios from 'axios'
import type { Customer, CustomerPurchase, BusinessGoal, SNCredentials, Activity, Partner, PartnerActivity } from '../types'

const TABLES = {
  CUSTOMER: 'u_customer_master',
  PURCHASE: 'u_customer_purchase',
  GOAL: 'u_business_goal',
  ACTIVITY: 'u_activity',
  PARTNER: 'u_partner',
  PARTNER_ACTIVITY: 'u_partner_activity',
}

function getAuthHeader(creds: SNCredentials) {
  return 'Basic ' + btoa(`${creds.username}:${creds.password}`)
}

function createClient(creds: SNCredentials) {
  const baseURL = import.meta.env.DEV ? '/snow-api' : `https://${creds.instance}`
  return axios.create({
    baseURL,
    headers: {
      Authorization: getAuthHeader(creds),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
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

export async function testConnection(creds: SNCredentials): Promise<boolean> {
  try {
    const client = createClient(creds)
    await client.get('/api/now/table/sys_user', {
      params: { sysparm_limit: 1, sysparm_fields: 'sys_id' },
    })
    return true
  } catch {
    return false
  }
}
