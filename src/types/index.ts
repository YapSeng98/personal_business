export interface Customer {
  sys_id: string
  u_name: string
  u_email: string
  u_phone: string
  u_company: string
  u_address: string
  u_notes: string
  sys_created_on: string
  sys_updated_on: string
}

export interface CustomerPurchase {
  sys_id: string
  u_customer: string
  u_customer_display: string
  u_product_name: string
  u_amount: string
  u_purchase_date: string
  u_status: 'pending' | 'completed' | 'cancelled'
  u_notes: string
  sys_created_on: string
}

export interface BusinessGoal {
  sys_id: string
  u_title: string
  u_description: string
  u_target_value: string
  u_current_value: string
  u_unit: string
  u_deadline: string
  u_status: 'active' | 'completed' | 'paused'
  u_category: string
  sys_created_on: string
  sys_updated_on: string
}

export interface SNCredentials {
  instance: string
  username: string
  password: string
}

export interface SNResponse<T> {
  result: T[]
}

export interface SNSingleResponse<T> {
  result: T
}
