import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Plus, Upload, Calendar as CalendarIcon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getActivities, createActivity, updateActivity, deleteActivity } from '../../services/servicenow'
import { geocodeAddress } from '../../services/geocoding'
import type { Activity } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { getMonthGrid, MONTH_NAMES, WEEKDAY_LABELS, dateKey } from '../../lib/calendar'
import ActivityForm from './ActivityForm'
import ActivityDetail from './ActivityDetail'
import BulkUploadModal from './BulkUploadModal'

const categoryDot: Record<string, string> = {
  Meeting: 'bg-blue-500',
  Training: 'bg-violet-500',
  'Product Launch': 'bg-amber-500',
  Recruiting: 'bg-emerald-500',
  Social: 'bg-pink-500',
  Recognition: 'bg-yellow-500',
  Workout: 'bg-cyan-500',
  Sport: 'bg-teal-500',
  Wellness: 'bg-rose-500',
  Other: 'bg-slate-400',
}

export default function ActivitiesCalendar() {
  const { credentials } = useAuth()
  const qc = useQueryClient()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(dateKey(today))
  const [modalOpen, setModalOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editActivity, setEditActivity] = useState<Activity | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(credentials!),
    enabled: !!credentials,
  })

  // Deep-link: arriving with ?activity=<id> (e.g. from the Dashboard) opens
  // that activity's detail — jump to its month/day and select it.
  useEffect(() => {
    const wantId = searchParams.get('activity')
    if (!wantId || !activities.length) return
    const a = activities.find(x => x.sys_id === wantId)
    if (a && a.u_activity_date) {
      const [y, m] = a.u_activity_date.split('-').map(Number)
      if (y && m) { setViewYear(y); setViewMonth(m - 1) }
      setSelectedDate(a.u_activity_date)
      setSelectedId(a.sys_id)
    }
    searchParams.delete('activity')
    setSearchParams(searchParams, { replace: true })
  }, [activities, searchParams, setSearchParams])

  const createMut = useMutation({
    mutationFn: async (data: Partial<Activity>) => {
      let lat = '', lng = '', geocode_status: Activity['u_geocode_status'] = 'pending'
      if (data.u_address) {
        const geo = await geocodeAddress(data.u_address)
        if (geo) { lat = geo.lat; lng = geo.lng; geocode_status = 'success' }
        else geocode_status = 'failed'
      }
      return createActivity(credentials!, { ...data, u_lat: lat, u_lng: lng, u_geocode_status: geocode_status, u_source: 'manual' })
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['activities'] }); setModalOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Activity> }) => {
      const patch = { ...data }
      if (data.u_address && data.u_address !== editActivity?.u_address) {
        const geo = await geocodeAddress(data.u_address)
        patch.u_lat = geo?.lat ?? ''
        patch.u_lng = geo?.lng ?? ''
        patch.u_geocode_status = geo ? 'success' : 'failed'
      }
      return updateActivity(credentials!, id, patch)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['activities'] }); setModalOpen(false); setEditActivity(null) },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteActivity(credentials!, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['activities'] }); setSelectedId(null) },
  })

  const grid = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, Activity[]>()
    for (const a of activities) {
      const list = map.get(a.u_activity_date) ?? []
      list.push(a)
      map.set(a.u_activity_date, list)
    }
    return map
  }, [activities])

  const dayActivities = useMemo(
    () => (activitiesByDate.get(selectedDate) ?? []).sort((a, b) => (a.u_activity_time || '').localeCompare(b.u_activity_time || '')),
    [activitiesByDate, selectedDate]
  )

  const selectedIdx = selectedId ? dayActivities.findIndex(a => a.sys_id === selectedId) : -1
  const selectedActivity = selectedIdx >= 0 ? dayActivities[selectedIdx] : null

  const handlePrev = useCallback(() => {
    if (selectedIdx > 0) setSelectedId(dayActivities[selectedIdx - 1].sys_id)
  }, [selectedIdx, dayActivities])

  const handleNext = useCallback(() => {
    if (selectedIdx < dayActivities.length - 1) setSelectedId(dayActivities[selectedIdx + 1].sys_id)
  }, [selectedIdx, dayActivities])

  useEffect(() => {
    document.body.style.overflow = selectedActivity ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedActivity])

  function goToMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  function goToday() {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setSelectedDate(dateKey(today))
  }

  function openEdit(a: Activity) {
    setEditActivity(a)
    setModalOpen(true)
  }

  function handleSubmit(data: Partial<Activity>) {
    if (editActivity) updateMut.mutate({ id: editActivity.sys_id, data })
    else createMut.mutate(data)
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={() => goToMonth(-1)} className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <h2 className="text-base font-semibold text-slate-900 w-40 text-center">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
          <button onClick={() => goToMonth(1)} className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
          <button onClick={goToday} className="btn-secondary py-1.5 px-3 text-xs">Today</button>
        </div>
        <div className="flex-1" />
        <button className="btn-secondary" onClick={() => setBulkOpen(true)}>
          <Upload className="w-4 h-4" /> Bulk Upload
        </button>
        <button className="btn-primary" onClick={() => { setEditActivity(null); setModalOpen(true) }}>
          <Plus className="w-4 h-4" /> New Activity
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Month grid */}
          <div className="card p-4 xl:col-span-2">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAY_LABELS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {grid.map(day => {
                const dayItems = activitiesByDate.get(day.dateKey) ?? []
                const isSelected = day.dateKey === selectedDate
                return (
                  <button
                    key={day.dateKey}
                    onClick={() => setSelectedDate(day.dateKey)}
                    className={`aspect-square rounded-xl p-1.5 flex flex-col items-center gap-1 transition-colors border ${
                      isSelected ? 'bg-brand-50 border-brand-300' : 'border-transparent hover:bg-slate-50'
                    } ${!day.inCurrentMonth ? 'opacity-30' : ''}`}
                  >
                    <span className={`text-xs font-medium ${day.isToday ? 'w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center' : 'text-slate-700'}`}>
                      {day.date.getDate()}
                    </span>
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {dayItems.slice(0, 3).map(a => (
                        <span key={a.sys_id} className={`w-1.5 h-1.5 rounded-full ${categoryDot[a.u_category] ?? 'bg-slate-400'}`} />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Day agenda */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">{selectedDate}</h3>
            {dayActivities.length === 0 ? (
              <EmptyState icon={CalendarIcon} title="No activities" description="Nothing scheduled for this day." />
            ) : (
              <div className="space-y-2">
                {dayActivities.map(a => (
                  <button
                    key={a.sys_id}
                    onClick={() => setSelectedId(a.sys_id)}
                    className="w-full text-left rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 px-3 py-2.5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${categoryDot[a.u_category] ?? 'bg-slate-400'}`} />
                      <p className="text-sm font-medium text-slate-800 truncate">{a.u_title}</p>
                    </div>
                    {a.u_activity_time && <p className="text-xs text-slate-400 mt-0.5">{a.u_activity_time}</p>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditActivity(null) }} title={editActivity ? 'Edit Activity' : 'New Activity'} size="lg">
        <ActivityForm
          initial={editActivity ?? { u_activity_date: selectedDate }}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditActivity(null) }}
          loading={createMut.isPending || updateMut.isPending}
        />
      </Modal>

      <Modal open={bulkOpen} onClose={() => setBulkOpen(false)} title="Bulk Upload Activities" size="lg">
        <BulkUploadModal onClose={() => setBulkOpen(false)} onDone={() => setBulkOpen(false)} />
      </Modal>

      {selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          onClose={() => setSelectedId(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < dayActivities.length - 1}
          index={selectedIdx}
          total={dayActivities.length}
          onEdit={() => { openEdit(selectedActivity); setSelectedId(null) }}
          onDelete={() => { if (confirm('Delete this activity?')) deleteMut.mutate(selectedActivity.sys_id) }}
        />
      )}
    </div>
  )
}
