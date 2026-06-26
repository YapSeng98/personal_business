import axios from 'axios'
import type { Customer, CustomerPurchase, BusinessGoal, SNCredentials } from '../types'

const TABLES = {
  CUSTOMER: 'u_customer_master',
  PURCHASE: 'u_customer_purchase',
  GOAL: 'u_business_goal',
}

function getAuthHeader(creds: SNCredentials) {
  return 'Basic ' + btoa(`${creds.username}:${creds.password}`)
}

function createClient(creds: SNCredentials) {
  return axios.create({
    baseURL: '/snow-api',
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
