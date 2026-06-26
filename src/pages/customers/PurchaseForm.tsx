import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { CustomerPurchase } from '../../types'

interface Props {
  initial?: Partial<CustomerPurchase>
  onSubmit: (data: Partial<CustomerPurchase>) => void
  onCancel: () => void
  loading?: boolean
}

export default function PurchaseForm({ initial, onSubmit, onCancel, loading }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    u_product_name: initial?.u_product_name ?? '',
    u_amount: initial?.u_amount ?? '',
    u_purchase_date: initial?.u_purchase_date ?? today,
    u_status: initial?.u_status ?? 'pending',
    u_notes: initial?.u_notes ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Product / Service *</label>
        <input className="input-field" required value={form.u_product_name} onChange={e => set('u_product_name', e.target.value)} placeholder="e.g. Website Design Package" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Amount (RM) *</label>
          <input className="input-field" required type="number" step="0.01" min="0" value={form.u_amount} onChange={e => set('u_amount', e.target.value)} placeholder="0.00" />
        </div>
        <div>
          <label className="label">Date</label>
          <input className="input-field" type="date" value={form.u_purchase_date} onChange={e => set('u_purchase_date', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Status</label>
        <select className="input-field" value={form.u_status} onChange={e => set('u_status', e.target.value)}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea className="input-field resize-none" rows={2} value={form.u_notes} onChange={e => set('u_notes', e.target.value)} placeholder="Additional notes..." />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" className="btn-secondary flex-1 justify-center" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Purchase'}
        </button>
      </div>
    </form>
  )
}
