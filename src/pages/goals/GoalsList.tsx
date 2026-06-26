import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Target, Trash2, TrendingUp, CheckCircle2, PauseCircle, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getGoals, deleteGoal, createGoal, updateGoal } from '../../services/servicenow'
import type { BusinessGoal } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import GoalForm from './GoalForm'

const statusIcon = {
  active: TrendingUp,
  completed: CheckCircle2,
  paused: PauseCircle,
}

const statusVariant: Record<string, 'green' | 'blue' | 'slate'> = {
  active: 'blue',
  completed: 'green',
  paused: 'slate',
}

function ProgressBar({ value, target }: { value: number; target: number }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-slate-500">Progress</span>
        <span className="font-semibold text-slate-700">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs mt-1.5 text-slate-400">
        <span>{value.toLocaleString()}</span>
        <span>of {target.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function GoalsList() {
  const { credentials } = useAuth()
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<BusinessGoal | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => getGoals(credentials!),
    enabled: !!credentials,
  })

  const createMut = useMutation({
    mutationFn: (data: Partial<BusinessGoal>) => createGoal(credentials!, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['goals'] }); setModalOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BusinessGoal> }) =>
      updateGoal(credentials!, id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['goals'] }); setModalOpen(false); setEditGoal(null) },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteGoal(credentials!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['goals'] }),
  })

  const filtered = filter === 'all' ? goals : goals.filter(g => g.u_status === filter)

  const activeGoals = goals.filter(g => g.u_status === 'active')
  const completedGoals = goals.filter(g => g.u_status === 'completed')

  function openEdit(g: BusinessGoal) {
    setEditGoal(g)
    setModalOpen(true)
  }

  function handleSubmit(data: Partial<BusinessGoal>) {
    if (editGoal) {
      updateMut.mutate({ id: editGoal.sys_id, data })
    } else {
      createMut.mutate(data)
    }
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-brand-600">{activeGoals.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Active Goals</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-emerald-600">{completedGoals.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Completed</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl font-bold text-slate-700">{goals.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Goals</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {['all', 'active', 'completed', 'paused'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button className="btn-primary" onClick={() => { setEditGoal(null); setModalOpen(true) }}>
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Goals grid */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Target}
            title="No goals yet"
            description="Set a personal business goal to start tracking."
            action={
              <button className="btn-primary" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4" /> New Goal
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(g => {
            const current = parseFloat(g.u_current_value || '0')
            const target = parseFloat(g.u_target_value || '0')
            const StatusIcon = statusIcon[g.u_status] ?? Target
            const isOverdue = g.u_deadline && new Date(g.u_deadline) < new Date() && g.u_status !== 'completed'

            return (
              <div key={g.sys_id} className="card hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      g.u_status === 'completed' ? 'bg-emerald-100' :
                      g.u_status === 'paused' ? 'bg-slate-100' : 'bg-brand-100'
                    }`}>
                      <StatusIcon className={`w-4 h-4 ${
                        g.u_status === 'completed' ? 'text-emerald-600' :
                        g.u_status === 'paused' ? 'text-slate-400' : 'text-brand-600'
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{g.u_title}</p>
                      {g.u_category && <p className="text-xs text-slate-400">{g.u_category}</p>}
                    </div>
                  </div>
                  <Badge label={g.u_status} variant={statusVariant[g.u_status] ?? 'slate'} />
                </div>

                {g.u_description && (
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{g.u_description}</p>
                )}

                {target > 0 && (
                  <ProgressBar value={current} target={target} />
                )}

                {g.u_unit && (
                  <p className="text-xs text-slate-400 mt-1">
                    Unit: <span className="font-medium text-slate-600">{g.u_unit}</span>
                  </p>
                )}

                {g.u_deadline && (
                  <div className={`flex items-center gap-1.5 text-xs mt-3 ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                    <Clock className="w-3 h-3" />
                    {isOverdue ? 'Overdue · ' : 'Deadline: '}
                    {new Date(g.u_deadline).toLocaleDateString('en-MY')}
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="btn-secondary flex-1 justify-center py-1.5 text-xs"
                    onClick={() => openEdit(g)}
                  >
                    Edit
                  </button>
                  {g.u_status !== 'completed' && (
                    <button
                      className="btn-primary flex-1 justify-center py-1.5 text-xs"
                      onClick={() => updateMut.mutate({ id: g.sys_id, data: { u_status: 'completed' } })}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                    </button>
                  )}
                  <button
                    className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    onClick={() => { if (confirm('Delete this goal?')) deleteMut.mutate(g.sys_id) }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditGoal(null) }}
        title={editGoal ? 'Edit Goal' : 'New Goal'}
      >
        <GoalForm
          initial={editGoal ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditGoal(null) }}
          loading={createMut.isPending || updateMut.isPending}
        />
      </Modal>
    </div>
  )
}
