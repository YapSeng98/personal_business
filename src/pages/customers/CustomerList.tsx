import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Search, Users, Trash2, ExternalLink, Building2, Phone, Mail } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getCustomers, deleteCustomer, createCustomer, updateCustomer } from '../../services/servicenow'
import type { Customer } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import CustomerForm from './CustomerForm'

export default function CustomerList() {
  const { credentials } = useAuth()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(credentials!),
    enabled: !!credentials,
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteCustomer(credentials!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  })

  const createMut = useMutation({
    mutationFn: (data: Partial<Customer>) => createCustomer(credentials!, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); setModalOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      updateCustomer(credentials!, id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); setModalOpen(false); setEditCustomer(null) },
  })

  const filtered = customers.filter(c =>
    [c.u_name, c.u_email, c.u_company, c.u_phone].some(f =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  )

  function openEdit(c: Customer) {
    setEditCustomer(c)
    setModalOpen(true)
  }

  function handleFormSubmit(data: Partial<Customer>) {
    if (editCustomer) {
      updateMut.mutate({ id: editCustomer.sys_id, data })
    } else {
      createMut.mutate(data)
    }
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()
    if (confirm('Delete this customer and all their purchase records?')) {
      deleteMut.mutate(id)
    }
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-9"
            placeholder="Search customers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          className="btn-primary"
          onClick={() => { setEditCustomer(null); setModalOpen(true) }}
        >
          <Plus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      {/* Stats badge */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Users className="w-4 h-4" />
        <span>{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Users}
            title="No customers yet"
            description="Add your first customer to get started."
            action={
              <button className="btn-primary" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4" /> Add Customer
              </button>
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">Contact</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.sys_id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs shrink-0">
                        {c.u_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{c.u_name}</p>
                        {c.u_email && <p className="text-xs text-slate-400">{c.u_email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    {c.u_company ? (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {c.u_company}
                      </div>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="space-y-0.5">
                      {c.u_phone && (
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <Phone className="w-3 h-3 text-slate-400" />{c.u_phone}
                        </div>
                      )}
                      {c.u_email && (
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <Mail className="w-3 h-3 text-slate-400" />{c.u_email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <Link
                        to={`/customers/${c.sys_id}`}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        title="View detail"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={e => handleDelete(e, c.sys_id)}
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

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditCustomer(null) }}
        title={editCustomer ? 'Edit Customer' : 'New Customer'}
      >
        <CustomerForm
          initial={editCustomer ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => { setModalOpen(false); setEditCustomer(null) }}
          loading={createMut.isPending || updateMut.isPending}
        />
      </Modal>
    </div>
  )
}
