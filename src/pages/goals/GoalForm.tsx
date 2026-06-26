import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { BusinessGoal } from '../../types'

interface Props {
  initial?: Partial<BusinessGoal>
  onSubmit: (data: Partial<BusinessGoal>) => void
  onCancel: () => void
  loading?: boolean
}

const categories = [
  'Revenue', 'Sales', 'Customers', 'Projects', 'Marketing',
  'Operations', 'Personal', 'Finance', 'Other'
]

export default function GoalForm({ initial, onSubmit, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    u_title: initial?.u_title ?? '',
    u_description: initial?.u_description ?? '',
    u_target_value: initial?.u_target_value ?? '',
    u_current_value: initial?.u_current_value ?? '0',
    u_unit: initial?.u_unit ?? '',
    u_deadline: initial?.u_deadline ?? '',
    u_status: initial?.u_status ?? 'active',
    u_category: initial?.u_category ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div>
        <label className="label">Goal Title *</label>
        <input className="input-field" required value={form.u_title} onChange={e => set('u_title', e.target.value)} placeholder="e.g. Reach RM 100k revenue" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input-field resize-none" rows={2} value={form.u_description} onChange={e => set('u_description', e.target.value)} placeholder="Describe this goal..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select className="input-field" value={form.u_category} onChange={e => set('u_category', e.target.value)}>
            <option value="">Select...</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Unit</label>
          <input className="input-field" value={form.u_unit} onChange={e => set('u_unit', e.target.value)} placeholder="RM, qty, %, customers..." />
        </div>
        <div>
          <label className="label">Target Value</label>
          <input className="input-field" type="number" step="any" min="0" value={form.u_target_value} onChange={e => set('u_target_value', e.target.value)} placeholder="100000" />
        </div>
        <div>
          <label className="label">Current Value</label>
          <input className="input-field" type="number" step="any" min="0" value={form.u_current_value} onChange={e => set('u_current_value', e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="label">Deadline</label>
          <input className="input-field" type="date" value={form.u_deadline} onChange={e => set('u_deadline', e.target.value)} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input-field" value={form.u_status} onChange={e => set('u_status', e.target.value)}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" className="btn-secondary flex-1 justify-center" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Goal'}
        </button>
      </div>
    </form>
  )
}
