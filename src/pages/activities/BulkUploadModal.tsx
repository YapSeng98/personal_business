import { useState } from 'react'
import * as XLSX from 'xlsx'
import { useQueryClient } from '@tanstack/react-query'
import { Download, Upload, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { createActivity } from '../../services/servicenow'
import { geocodeAddress } from '../../services/geocoding'
import { ACTIVITY_CATEGORIES, type Activity, type ActivityCategory } from '../../types'

const TEMPLATE_HEADERS = ['Title', 'Description', 'Date', 'Time', 'Address', 'Category', 'Tags']

interface ParsedRow {
  rowIndex: number
  title: string
  description: string
  date: string
  time: string
  address: string
  category: ActivityCategory
  tags: string
  valid: boolean
  errors: string[]
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  if (typeof value === 'string' && value.trim()) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${dd}`
    }
  }
  return ''
}

function parseRows(raw: Record<string, unknown>[]): ParsedRow[] {
  return raw.map((r, i) => {
    const title = String(r['Title'] ?? '').trim()
    const date = normalizeDate(r['Date'])
    const errors: string[] = []
    if (!title) errors.push('Missing title')
    if (!date) errors.push('Missing/invalid date')

    const categoryRaw = String(r['Category'] ?? '').trim()
    const matchedCategory = ACTIVITY_CATEGORIES.find(c => c.toLowerCase() === categoryRaw.toLowerCase())

    return {
      rowIndex: i + 2,
      title,
      description: String(r['Description'] ?? '').trim(),
      date,
      time: String(r['Time'] ?? '').trim(),
      address: String(r['Address'] ?? '').trim(),
      category: matchedCategory ?? 'Other',
      tags: String(r['Tags'] ?? '').trim(),
      valid: errors.length === 0,
      errors,
    }
  })
}

export default function BulkUploadModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { credentials } = useAuth()
  const qc = useQueryClient()
  const [rows, setRows] = useState<ParsedRow[] | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState<{ created: number; geocodeFailed: number; createFailed: number } | null>(null)

  function downloadTemplate() {
    const sample = [
      TEMPLATE_HEADERS,
      ['Monthly Business Briefing', 'Overview of new plans', '2026-08-15', '19:00', '1 Utama Shopping Centre, Petaling Jaya', 'Meeting', 'Business Building, Recruiting'],
    ]
    const sheet = XLSX.utils.aoa_to_sheet(sample)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Activities')
    XLSX.writeFile(wb, 'biztrack-activity-template.xlsx')
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSummary(null)
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf, { type: 'array' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
    setRows(parseRows(raw))
    e.target.value = ''
  }

  async function handleImport() {
    if (!rows || !credentials) return
    setImporting(true)
    setProgress(0)
    let created = 0, geocodeFailed = 0, createFailed = 0
    const validRows = rows.filter(r => r.valid)

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      let lat = '', lng = ''
      let geocodeStatus: Activity['u_geocode_status'] = 'pending'
      if (row.address) {
        const geo = await geocodeAddress(row.address)
        if (geo) {
          lat = geo.lat; lng = geo.lng; geocodeStatus = 'success'
        } else {
          geocodeStatus = 'failed'
          geocodeFailed++
        }
      }
      try {
        await createActivity(credentials, {
          u_title: row.title,
          u_description: row.description,
          u_category: row.category,
          u_tags: row.tags,
          u_activity_date: row.date,
          u_activity_time: row.time,
          u_address: row.address,
          u_lat: lat,
          u_lng: lng,
          u_geocode_status: geocodeStatus,
          u_status: 'planned',
          u_source: 'bulk_upload',
        })
        created++
      } catch {
        createFailed++
      }
      setProgress(Math.round(((i + 1) / validRows.length) * 100))
    }

    setImporting(false)
    setSummary({ created, geocodeFailed, createFailed })
    qc.invalidateQueries({ queryKey: ['activities'] })
  }

  const validCount = rows?.filter(r => r.valid).length ?? 0
  const invalidCount = rows ? rows.length - validCount : 0

  return (
    <div className="space-y-4">
      <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <p className="text-sm text-blue-900 leading-relaxed">
          Download the template, fill in one row per activity, then upload it here. Addresses are looked up
          on a free map service (~1 row/second), so large uploads take a little time.
        </p>
      </div>

      <button className="btn-secondary w-full justify-center" onClick={downloadTemplate}>
        <Download className="w-4 h-4" /> Download Excel Template
      </button>

      <div>
        <label className="label">Upload Filled Template</label>
        <input type="file" accept=".xlsx,.xls" className="input-field" onChange={handleFile} />
      </div>

      {rows && !summary && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="w-4 h-4" />{validCount} valid</span>
            {invalidCount > 0 && (
              <span className="flex items-center gap-1.5 text-amber-700"><AlertTriangle className="w-4 h-4" />{invalidCount} skipped</span>
            )}
          </div>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
            {rows.map(r => (
              <div key={r.rowIndex} className={`px-3 py-2 text-xs ${r.valid ? '' : 'bg-red-50'}`}>
                <p className={`font-medium ${r.valid ? 'text-slate-800' : 'text-red-700'}`}>
                  Row {r.rowIndex}: {r.title || '(no title)'} {!r.valid && `— ${r.errors.join(', ')}`}
                </p>
              </div>
            ))}
          </div>
          {importing && (
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}
          <button className="btn-primary w-full justify-center" onClick={handleImport} disabled={importing || validCount === 0}>
            {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Importing {progress}%...</> : <><Upload className="w-4 h-4" /> Import {validCount} Activities</>}
          </button>
        </div>
      )}

      {summary && (
        <div className="space-y-3">
          <div className="flex gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-900 leading-relaxed">
              Created {summary.created} activities.
              {summary.geocodeFailed > 0 && ` ${summary.geocodeFailed} addresses couldn't be located on the map.`}
              {summary.createFailed > 0 && ` ${summary.createFailed} rows failed to save.`}
            </p>
          </div>
          <button className="btn-primary w-full justify-center" onClick={onDone}>Done</button>
        </div>
      )}

      {!summary && (
        <button className="btn-secondary w-full justify-center" onClick={onClose}>Close</button>
      )}
    </div>
  )
}
