import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { Customer } from '../../types'

interface Props {
  initial?: Partial<Customer>
  onSubmit: (data: Partial<Customer>) => void
  onCancel: () => void
  loading?: boolean
}

export default function CustomerForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    u_name: initial?.u_name ?? '',
    u_email: initial?.u_email ?? '',
    u_phone: initial?.u_phone ?? '',
    u_company: initial?.u_company ?? '',
    u_address: initial?.u_address ?? '',
    u_notes: initial?.u_notes ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Name *</label>
          <input className="input-field" required value={form.u_name} onChange={e => set('u_name', e.target.value)} placeholder="Full name" />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input-field" type="email" value={form.u_email} onChange={e => set('u_email', e.target.value)} placeholder="email@example.com" />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input-field" value={form.u_phone} onChange={e => set('u_phone', e.target.value)} placeholder="+60 12-345 6789" />
        </div>
        <div className="col-span-2">
          <label className="label">Company</label>
          <input className="input-field" value={form.u_company} onChange={e => set('u_company', e.target.value)} placeholder="Company name" />
        </div>
        <div className="col-span-2">
          <label className="label">Address</label>
          <input className="input-field" value={form.u_address} onChange={e => set('u_address', e.target.value)} placeholder="Street address" />
        </div>
        <div className="col-span-2">
          <label className="label">Notes</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={form.u_notes}
            onChange={e => set('u_notes', e.target.value)}
            placeholder="Any additional notes..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" className="btn-secondary flex-1 justify-center" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Customer'}
        </button>
      </div>
    </form>
  )
}
