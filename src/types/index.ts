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

export interface AppUser {
  sys_id: string
  username: string
  display_name: string
  email: string
}

// Passed to the data service layer — instance + session token.
export interface SNCredentials {
  instance: string
  token: string
}

export interface Session extends SNCredentials {
  user: AppUser
}

export interface SNResponse<T> {
  result: T[]
}

export interface SNSingleResponse<T> {
  result: T
}

export type ActivityCategory =
  | 'Meeting'
  | 'Training'
  | 'Product Launch'
  | 'Recruiting'
  | 'Social'
  | 'Recognition'
  | 'Workout'
  | 'Sport'
  | 'Wellness'
  | 'Other'

// Preset options shown in the picker. "Other" reveals a free-text field,
// so u_category can also hold any custom value the user types.
export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  'Meeting',
  'Training',
  'Product Launch',
  'Recruiting',
  'Social',
  'Recognition',
  'Workout',
  'Sport',
  'Wellness',
  'Other',
]

export interface Activity {
  sys_id: string
  u_title: string
  u_description: string
  u_category: string  // a preset ActivityCategory or a custom "Other" value
  u_tags: string
  u_activity_date: string
  u_activity_time: string
  u_all_day: string   // 'true' = whole-day activity (no specific time)
  u_address: string
  u_lat: string
  u_lng: string
  u_geocode_status: 'pending' | 'success' | 'failed' | 'manual'
  u_status: 'planned' | 'confirmed' | 'completed' | 'cancelled'
  u_source: 'manual' | 'bulk_upload'
  sys_created_on: string
  sys_updated_on: string
}

export interface Partner {
  sys_id: string
  u_name: string
  u_email: string
  u_phone: string
  u_status: 'active' | 'inactive' | 'prospect'
  u_account_type: 'ABO' | 'ABC' | ''   // ABO = Business Owner, ABC = Business Customer
  u_network_position: 'upline' | 'downline' | 'cross_line' | 'prospect'
  u_rank: string
  u_sponsor: string
  u_sponsor_display: string
  u_partner_of: string
  u_partner_of_display: string
  u_customer: string
  u_customer_display: string
  u_interest_tags: string
  u_notes: string
  sys_created_on: string
  sys_updated_on: string
}

export interface PartnerActivity {
  sys_id: string
  u_partner: string
  u_partner_display: string
  u_activity: string
  u_activity_display: string
  u_interested: 'interested' | 'not_interested' | 'unknown'
  u_confirmed: 'confirmed' | 'declined' | 'pending'
  u_role_in_activity: string
  sys_created_on: string
}
