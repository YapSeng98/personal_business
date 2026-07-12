import { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Search, Network, Trash2, Mail, Phone, GitBranch } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getPartners, deletePartner, createPartner, updatePartner } from '../../services/servicenow'
import type { Partner } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import PartnerForm from './PartnerForm'
import PartnerDetail from './PartnerDetail'

const statusVariant: Record<string, 'green' | 'slate' | 'yellow'> = {
  active: 'green',
  inactive: 'slate',
  prospect: 'yellow',
}

type Tab = 'all' | 'unassigned'

export default function PartnerList() {
  const { credentials } = useAuth()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editPartner, setEditPartner] = useState<Partner | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: () => getPartners(credentials!),
    enabled: !!credentials,
  })

  const createMut = useMutation({
    mutationFn: (data: Partial<Partner>) => createPartner(credentials!, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partners'] }); setModalOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Partner> }) => updatePartner(credentials!, id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partners'] }); setModalOpen(false); setEditPartner(null) },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deletePartner(credentials!, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partners'] }); setSelectedId(null) },
  })

  const filtered = useMemo(() => {
    return partners.filter(p => {
      const matchTab = tab === 'all' || (tab === 'unassigned' && !p.u_sponsor)
      const q = search.toLowerCase()
      const matchSearch = !q || [p.u_name, p.u_email, p.u_phone, p.u_rank].some(f => f?.toLowerCase().includes(q))
      return matchTab && matchSearch
    })
  }, [partners, tab, search])

  const unassignedCount = partners.filter(p => !p.u_sponsor).length

  const selectedIdx = selectedId ? filtered.findIndex(p => p.sys_id === selectedId) : -1
  const selectedPartner = selectedIdx >= 0 ? filtered[selectedIdx] : null

  const handlePrev = useCallback(() => {
    if (selectedIdx > 0) setSelectedId(filtered[selectedIdx - 1].sys_id)
  }, [selectedIdx, filtered])

  const handleNext = useCallback(() => {
    if (selectedIdx < filtered.length - 1) setSelectedId(filtered[selectedIdx + 1].sys_id)
  }, [selectedIdx, filtered])

  useEffect(() => {
    document.body.style.overflow = selectedPartner ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedPartner])

  function openEdit(p: Partner) {
    setEditPartner(p)
    setModalOpen(true)
  }

  function handleSubmit(data: Partial<Partner>) {
    if (editPartner) {
      updateMut.mutate({ id: editPartner.sys_id, data })
    } else {
      createMut.mutate(data)
    }
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Delete this partner? Linked activity records will remain but lose this reference.')) {
      deleteMut.mutate(id)
    }
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input-field pl-9" placeholder="Search partners..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Link to="/partners/tree" className="btn-secondary">
          <GitBranch className="w-4 h-4" /> View Tree
        </Link>
        <button className="btn-primary" onClick={() => { setEditPartner(null); setModalOpen(true) }}>
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          All Partners ({partners.length})
        </button>
        <button
          onClick={() => setTab('unassigned')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'unassigned' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Unassigned ({unassignedCount})
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Network}
            title={tab === 'unassigned' ? 'No unassigned partners' : 'No partners yet'}
            description={tab === 'unassigned' ? 'Every partner has a sponsor assigned.' : 'Add your first partner to start building your network.'}
            action={
              tab === 'all' && (
                <button className="btn-primary" onClick={() => setModalOpen(true)}>
                  <Plus className="w-4 h-4" /> Add Partner
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">Position / Rank</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">Sponsor</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.sys_id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedId(p.sys_id)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs shrink-0">
                        {p.u_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{p.u_name}</p>
                        {p.u_email && <p className="text-xs text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" />{p.u_email}</p>}
                        {!p.u_email && p.u_phone && <p className="text-xs text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" />{p.u_phone}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge label={p.u_status} variant={statusVariant[p.u_status] ?? 'slate'} />
                      {p.u_account_type && <Badge label={p.u_account_type} variant="purple" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-slate-600 capitalize">{p.u_network_position.replace('_', '-')}</p>
                    {p.u_rank && <p className="text-xs text-slate-400">{p.u_rank}</p>}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {p.u_sponsor_display ? (
                      <span className="text-slate-600">{p.u_sponsor_display}</span>
                    ) : (
                      <Badge label="Unassigned" variant="yellow" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(p) }}
                        className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={e => handleDelete(e, p.sys_id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditPartner(null) }} title={editPartner ? 'Edit Partner' : 'Add Partner'} size="lg">
        <PartnerForm
          initial={editPartner ?? undefined}
          partners={partners}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditPartner(null) }}
          loading={createMut.isPending || updateMut.isPending}
        />
      </Modal>

      {selectedPartner && (
        <PartnerDetail
          partner={selectedPartner}
          onClose={() => setSelectedId(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < filtered.length - 1}
          index={selectedIdx}
          total={filtered.length}
          onEdit={() => { openEdit(selectedPartner); setSelectedId(null) }}
          onDelete={() => { if (confirm('Delete this partner?')) deleteMut.mutate(selectedPartner.sys_id) }}
        />
      )}
    </div>
  )
}
