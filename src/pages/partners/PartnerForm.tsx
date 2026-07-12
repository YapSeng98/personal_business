import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { Partner } from '../../types'

interface Props {
  initial?: Partial<Partner>
  partners: Partner[]
  onSubmit: (data: Partial<Partner>) => void
  onCancel: () => void
  loading?: boolean
}

const RANKS = [
  '', 'Distributor', 'Silver Producer', 'Gold Producer', 'Platinum',
  'Sapphire', 'Emerald', 'Diamond', 'Founders Diamond',
]

export default function PartnerForm({ initial, partners, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    u_name: initial?.u_name ?? '',
    u_email: initial?.u_email ?? '',
    u_phone: initial?.u_phone ?? '',
    u_status: initial?.u_status ?? 'prospect',
    u_account_type: initial?.u_account_type ?? '',
    u_network_position: initial?.u_network_position ?? 'prospect',
    u_rank: initial?.u_rank ?? '',
    u_sponsor: initial?.u_sponsor ?? '',
    u_partner_of: initial?.u_partner_of ?? '',
    u_interest_tags: initial?.u_interest_tags ?? '',
    u_notes: initial?.u_notes ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  const otherPartners = partners.filter(p => p.sys_id !== initial?.sys_id)

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Name *</label>
        <input className="input-field" required value={form.u_name} onChange={e => set('u_name', e.target.value)} placeholder="Partner's full name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Email</label>
          <input className="input-field" type="email" value={form.u_email} onChange={e => set('u_email', e.target.value)} placeholder="partner@email.com" />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input-field" value={form.u_phone} onChange={e => set('u_phone', e.target.value)} placeholder="+60 12-345 6789" />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input-field" value={form.u_status} onChange={e => set('u_status', e.target.value)}>
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="label">Account Type</label>
          <select className="input-field" value={form.u_account_type} onChange={e => set('u_account_type', e.target.value)}>
            <option value="">Select...</option>
            <option value="ABO">ABO — Business Owner</option>
            <option value="ABC">ABC — Business Customer</option>
          </select>
        </div>
        <div>
          <label className="label">Network Position</label>
          <select className="input-field" value={form.u_network_position} onChange={e => set('u_network_position', e.target.value)}>
            <option value="prospect">Prospect</option>
            <option value="downline">Downline</option>
            <option value="upline">Upline</option>
            <option value="cross_line">Cross-line</option>
          </select>
        </div>
        <div>
          <label className="label">Rank / Pin Level</label>
          <select className="input-field" value={form.u_rank} onChange={e => set('u_rank', e.target.value)}>
            {RANKS.map(r => <option key={r} value={r}>{r || 'Select...'}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Sponsor (Upline)</label>
          <select className="input-field" value={form.u_sponsor} onChange={e => set('u_sponsor', e.target.value)}>
            <option value="">Unassigned</option>
            {otherPartners.map(p => <option key={p.sys_id} value={p.sys_id}>{p.u_name}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Partner's Partner (e.g. spouse also in the business)</label>
          <select className="input-field" value={form.u_partner_of} onChange={e => set('u_partner_of', e.target.value)}>
            <option value="">None</option>
            {otherPartners.map(p => <option key={p.sys_id} value={p.sys_id}>{p.u_name}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Interest Tags</label>
          <input className="input-field" value={form.u_interest_tags} onChange={e => set('u_interest_tags', e.target.value)} placeholder="e.g. Health Products, Business Building, Beauty" />
        </div>
        <div className="col-span-2">
          <label className="label">Notes</label>
          <textarea className="input-field resize-none" rows={2} value={form.u_notes} onChange={e => set('u_notes', e.target.value)} placeholder="Follow-up notes..." />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" className="btn-secondary flex-1 justify-center" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Partner'}
        </button>
      </div>
    </form>
  )
}
