// ============================================================
// Demo backend — lets anyone explore BizTrack with realistic
// sample data, no ServiceNow required. Activated when the session
// token is 'demo'. An axios adapter serves the same Table-API shape
// the real service layer uses, from an in-memory store.
// ============================================================
import type { AxiosAdapter } from 'axios'

type Row = Record<string, unknown>
const store: Record<string, Row[]> = {}
let seeded = false
let counter = 1
const nid = () => 'demo-' + counter++

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function monthsAgo(n: number, day = 12) {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  d.setDate(day)
  return ymd(d)
}
function thisMonth(day: number) {
  const d = new Date()
  d.setDate(day)
  return ymd(d)
}

function seed() {
  // ── Customers ──
  store.u_customer_master = [
    { sys_id: 'c1', u_name: 'Tan Ai Ling', u_email: 'aling@sunrise.my', u_phone: '012-3456789', u_company: 'Sunrise Trading', u_address: 'Petaling Jaya', u_notes: 'Prefers WhatsApp.', sys_created_on: monthsAgo(5) },
    { sys_id: 'c2', u_name: 'Kumar Selvam', u_email: 'kumar@ksent.my', u_phone: '016-2223344', u_company: 'KS Enterprise', u_address: 'Klang', u_notes: '', sys_created_on: monthsAgo(4) },
    { sys_id: 'c3', u_name: 'Nurul Huda', u_email: 'nurul@gmail.com', u_phone: '019-8887766', u_company: '', u_address: 'Shah Alam', u_notes: 'Interested in skincare range.', sys_created_on: monthsAgo(3) },
    { sys_id: 'c4', u_name: 'Wong Jia Hui', u_email: 'jiahui@digisol.my', u_phone: '011-33445566', u_company: 'Digital Solutions', u_address: 'Kuala Lumpur', u_notes: '', sys_created_on: monthsAgo(2) },
    { sys_id: 'c5', u_name: 'Lim Boon Keng', u_email: 'bklim@outlook.com', u_phone: '012-9001122', u_company: '', u_address: 'Subang Jaya', u_notes: 'Bulk buyer.', sys_created_on: monthsAgo(1) },
    { sys_id: 'c6', u_name: 'Priya Nair', u_email: 'priya.nair@gmail.com', u_phone: '017-4455667', u_company: 'Wellness Co', u_address: 'Cheras', u_notes: '', sys_created_on: thisMonth(3) },
  ]

  // ── Purchases (spread across months for the revenue chart) ──
  const P = (id: string, cust: string, product: string, amount: string, date: string, status: string) =>
    ({ sys_id: id, u_customer: cust, u_product_name: product, u_amount: amount, u_purchase_date: date, u_status: status, u_notes: '', sys_created_on: date })
  store.u_customer_purchase = [
    P('pu1', 'c1', 'Nutrilite All Plant Protein', '226.00', monthsAgo(5, 14), 'completed'),
    P('pu2', 'c2', 'Double X Multivitamin', '348.00', monthsAgo(5, 20), 'completed'),
    P('pu3', 'c1', 'Artistry Hydra-V Set', '512.00', monthsAgo(4, 8), 'completed'),
    P('pu4', 'c3', 'Nutrilite Bio C', '112.00', monthsAgo(4, 19), 'completed'),
    P('pu5', 'c4', 'eSpring Water Purifier', '2330.00', monthsAgo(3, 6), 'completed'),
    P('pu6', 'c2', 'Nutrilite Cal Mag D', '98.00', monthsAgo(3, 22), 'completed'),
    P('pu7', 'c5', 'Atmosphere Sky Purifier', '4780.00', monthsAgo(2, 11), 'completed'),
    P('pu8', 'c3', 'Artistry Supreme LX Cream', '467.00', monthsAgo(2, 27), 'completed'),
    P('pu9', 'c6', 'Nutrilite Omega', '138.00', monthsAgo(1, 9), 'completed'),
    P('pu10', 'c1', 'Glister Toothpaste x3', '97.50', monthsAgo(1, 18), 'completed'),
    P('pu11', 'c4', 'Satinique Shampoo Set', '160.00', thisMonth(5), 'pending'),
    P('pu12', 'c5', 'Nutrilite Double X Refill', '322.00', thisMonth(8), 'pending'),
  ]

  // ── Goals ──
  store.u_business_goal = [
    { sys_id: 'g1', u_title: 'Reach RM 100k revenue', u_description: 'Total completed sales this year.', u_target_value: '100000', u_current_value: '62000', u_unit: 'RM', u_deadline: monthsAgo(-5, 31), u_status: 'active', u_category: 'Revenue', sys_created_on: monthsAgo(5) },
    { sys_id: 'g2', u_title: 'Recruit 15 partners', u_description: 'Grow the downline network.', u_target_value: '15', u_current_value: '6', u_unit: 'partners', u_deadline: monthsAgo(-3, 30), u_status: 'active', u_category: 'Recruiting', sys_created_on: monthsAgo(4) },
    { sys_id: 'g3', u_title: 'Qualify Platinum', u_description: 'Hit Platinum pin level.', u_target_value: '100', u_current_value: '45', u_unit: '%', u_deadline: monthsAgo(-6, 31), u_status: 'active', u_category: 'Personal', sys_created_on: monthsAgo(2) },
  ]

  // ── Partners (a real tree + a spouse link + unassigned) ──
  const PA = (sys_id: string, name: string, status: string, pos: string, rank: string, sponsor: string, partnerOf: string, tags: string, email = '', phone = '') =>
    ({ sys_id, u_name: name, u_email: email, u_phone: phone, u_status: status, u_network_position: pos, u_rank: rank, u_sponsor: sponsor, u_partner_of: partnerOf, u_customer: '', u_interest_tags: tags, u_notes: '', sys_created_on: monthsAgo(4) })
  store.u_partner = [
    PA('p1', 'Sarah Lim', 'active', 'downline', 'Emerald', '', '', 'Health, Business Building', 'sarah@biz.my', '012-1112222'),
    PA('p2', 'Ahmad Zaki', 'active', 'downline', 'Platinum', 'p1', '', 'Health, Recruiting', 'ahmad@biz.my', '013-3334444'),
    PA('p3', 'Mei Ling', 'active', 'downline', 'Gold Producer', 'p1', '', 'Beauty, Skincare', 'meiling@biz.my'),
    PA('p4', 'Ravi Kumar', 'prospect', 'downline', 'Silver Producer', 'p2', '', 'Fitness, Recruiting'),
    PA('p5', 'Jenny Tan', 'active', 'cross_line', '', '', 'p3', 'Beauty, Social', 'jenny@biz.my'),
    PA('p6', 'David Wong', 'prospect', 'prospect', '', '', '', 'Business Building'),
  ]

  // ── Activities (KL landmarks with real coords for the map) ──
  const AC = (sys_id: string, title: string, cat: string, tags: string, day: number, time: string, addr: string, lat: string, lng: string) =>
    ({ sys_id, u_title: title, u_description: title + '.', u_category: cat, u_tags: tags, u_activity_date: thisMonth(day), u_activity_time: time, u_address: addr, u_lat: lat, u_lng: lng, u_geocode_status: 'success', u_status: 'planned', u_source: 'manual', sys_created_on: monthsAgo(0) })
  store.u_activity = [
    AC('a1', 'Product Launch — Artistry', 'Product Launch', 'Beauty, Skincare', 6, '14:00', 'Pavilion Kuala Lumpur', '3.1490', '101.7130'),
    AC('a2', 'Health Talk & Tasting', 'Meeting', 'Health, Business Building', 12, '19:30', 'Suria KLCC, Kuala Lumpur', '3.1579', '101.7123'),
    AC('a3', 'Recruiting Open Day', 'Recruiting', 'Recruiting', 18, '10:00', '1 Utama Shopping Centre, PJ', '3.1502', '101.6153'),
    AC('a4', 'Leadership Training', 'Training', 'Business Building, Recruiting', 22, '09:00', 'Sunway Pyramid, Subang Jaya', '3.0726', '101.6070'),
    AC('a5', 'Recognition Night', 'Recognition', 'Social', 27, '20:00', 'MITEC, Kuala Lumpur', '3.1710', '101.6640'),
  ]

  // ── Invitations / RSVP ──
  store.u_partner_activity = [
    { sys_id: 'pa1', u_partner: 'p2', u_activity: 'a2', u_interested: 'interested', u_confirmed: 'confirmed', u_role_in_activity: 'Speaker', sys_created_on: monthsAgo(0) },
    { sys_id: 'pa2', u_partner: 'p3', u_activity: 'a1', u_interested: 'interested', u_confirmed: 'pending', u_role_in_activity: 'Attendee', sys_created_on: monthsAgo(0) },
    { sys_id: 'pa3', u_partner: 'p4', u_activity: 'a3', u_interested: 'interested', u_confirmed: 'confirmed', u_role_in_activity: 'Organizer', sys_created_on: monthsAgo(0) },
  ]

  store.u_app_user = []
  store.u_app_session = []
  seeded = true
}

const find = (table: string, id: string) => (store[table] || []).find(r => r.sys_id === id)

function withDot(table: string, r: Row): Row {
  const o: Row = { ...r }
  if (table === 'u_customer_purchase') o['u_customer.u_name'] = r.u_customer ? (find('u_customer_master', r.u_customer as string) as Row)?.u_name ?? '' : ''
  if (table === 'u_partner') {
    o['u_sponsor.u_name'] = r.u_sponsor ? (find('u_partner', r.u_sponsor as string) as Row)?.u_name ?? '' : ''
    o['u_partner_of.u_name'] = r.u_partner_of ? (find('u_partner', r.u_partner_of as string) as Row)?.u_name ?? '' : ''
    o['u_customer.u_name'] = r.u_customer ? (find('u_customer_master', r.u_customer as string) as Row)?.u_name ?? '' : ''
  }
  if (table === 'u_partner_activity') {
    o['u_partner.u_name'] = r.u_partner ? (find('u_partner', r.u_partner as string) as Row)?.u_name ?? '' : ''
    o['u_activity.u_title'] = r.u_activity ? (find('u_activity', r.u_activity as string) as Row)?.u_title ?? '' : ''
  }
  return o
}

function matchQuery(r: Row, q: string): boolean {
  if (!q) return true
  return q.split('^').every(clause => {
    const [field, value] = clause.split('=')
    return String(r[field] ?? '') === value
  })
}

export const demoAdapter: AxiosAdapter = async config => {
  if (!seeded) seed()
  const url = config.url || ''
  const m = url.match(/\/api\/now\/table\/([^/?]+)(?:\/([^/?]+))?/)
  const table = m?.[1]
  const id = m?.[2]
  const method = (config.method || 'get').toLowerCase()
  const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {})
  const done = (result: unknown, status = 200) =>
    ({ data: { result }, status, statusText: 'OK', headers: {}, config } as never)

  if (!table || !store[table]) return done([], 200)

  if (method === 'get') {
    if (id) { const r = find(table, id); return done(r ? withDot(table, r) : {}) }
    let rows = store[table].slice()
    const p = (config.params || {}) as Record<string, string>
    if (p.sysparm_query) rows = rows.filter(r => matchQuery(r, p.sysparm_query))
    if (p.sysparm_order_by) {
      const f = p.sysparm_order_by
      rows.sort((a, b) => String(a[f] ?? '').localeCompare(String(b[f] ?? '')))
      if (String(p.sysparm_order_by_desc) === 'true') rows.reverse()
    }
    if (p.sysparm_limit) rows = rows.slice(0, parseInt(p.sysparm_limit, 10))
    return done(rows.map(r => withDot(table, r)))
  }
  if (method === 'post') {
    const r: Row = { sys_id: nid(), sys_created_on: ymd(new Date()), sys_updated_on: ymd(new Date()), ...body }
    store[table].push(r)
    return done(withDot(table, r), 201)
  }
  if (method === 'patch') {
    const r = find(table, id!)
    if (r) Object.assign(r, body)
    return done(r ? withDot(table, r) : {})
  }
  if (method === 'delete') {
    store[table] = store[table].filter(r => r.sys_id !== id)
    return done({})
  }
  return done({})
}
