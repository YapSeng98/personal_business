import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ACTIVITY_CATEGORIES, type Activity } from '../../types'
import { isAllDay } from '../../lib/activity'

interface Props {
  initial?: Partial<Activity>
  onSubmit: (data: Partial<Activity>) => void
  onCancel: () => void
  loading?: boolean
}

export default function ActivityForm({ initial, onSubmit, onCancel, loading }: Props) {
  // If the saved category isn't a preset, it's a custom "Other" value.
  const presetInitial = initial?.u_category && (ACTIVITY_CATEGORIES as string[]).includes(initial.u_category)
  const [category, setCategory] = useState<string>(
    initial?.u_category ? (presetInitial ? initial.u_category : 'Other') : 'Meeting'
  )
  const [customCategory, setCustomCategory] = useState(presetInitial ? '' : (initial?.u_category ?? ''))
  const [allDay, setAllDay] = useState(isAllDay(initial))

  const [form, setForm] = useState({
    u_title: initial?.u_title ?? '',
    u_description: initial?.u_description ?? '',
    u_tags: initial?.u_tags ?? '',
    u_activity_date: initial?.u_activity_date ?? '',
    u_activity_time: initial?.u_activity_time ?? '',
    u_address: initial?.u_address ?? '',
    u_status: initial?.u_status ?? 'planned',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const u_category = category === 'Other' && customCategory.trim() ? customCategory.trim() : category
    onSubmit({
      ...form,
      u_category,
      u_all_day: allDay ? 'true' : 'false',
      u_activity_time: allDay ? '' : form.u_activity_time,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input className="input-field" required value={form.u_title} onChange={e => set('u_title', e.target.value)} placeholder="e.g. Monthly Business Briefing" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input-field resize-none" rows={2} value={form.u_description} onChange={e => set('u_description', e.target.value)} placeholder="Describe this activity..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
            {ACTIVITY_CATEGORIES.map(c => <option key={c} value={c}>{c === 'Other' ? 'Other (specify)…' : c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input-field" value={form.u_status} onChange={e => set('u_status', e.target.value)}>
            <option value="planned">Planned</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {category === 'Other' && (
          <div className="col-span-2">
            <label className="label">Custom category</label>
            <input
              className="input-field"
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              placeholder="e.g. Hiking, Charity Drive, Webinar…"
              autoFocus
            />
          </div>
        )}
        <div className="col-span-2">
          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
            <input type="checkbox" className="w-4 h-4 rounded accent-brand-600" checked={allDay} onChange={e => setAllDay(e.target.checked)} />
            <span className="text-sm text-slate-700">All day <span className="text-slate-400">— no specific time</span></span>
          </label>
        </div>
        <div className={allDay ? 'col-span-2' : ''}>
          <label className="label">Date *</label>
          <input className="input-field" type="date" required value={form.u_activity_date} onChange={e => set('u_activity_date', e.target.value)} />
        </div>
        {!allDay && (
          <div>
            <label className="label">Time</label>
            <input className="input-field" type="time" value={form.u_activity_time} onChange={e => set('u_activity_time', e.target.value)} />
          </div>
        )}
        <div className="col-span-2">
          <label className="label">Address</label>
          <input className="input-field" value={form.u_address} onChange={e => set('u_address', e.target.value)} placeholder="Full address for map lookup" />
        </div>
        <div className="col-span-2">
          <label className="label">Tags</label>
          <input className="input-field" value={form.u_tags} onChange={e => set('u_tags', e.target.value)} placeholder="e.g. Health Products, Business Building — matched against partner interests" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" className="btn-secondary flex-1 justify-center" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Activity'}
        </button>
      </div>
    </form>
  )
}
