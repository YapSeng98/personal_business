import type { Activity } from '../types'

// ServiceNow True/False fields come back as "1"/"0" through the API, while the
// demo backend (and the form) use "true"/"false". Treat all of them as all-day.
export function isAllDay(a: { u_all_day?: string } | Partial<Activity> | null | undefined): boolean {
  const v = a?.u_all_day
  return v === 'true' || v === '1'
}
