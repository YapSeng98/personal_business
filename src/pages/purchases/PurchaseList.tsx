import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Search, ShoppingCart, Trash2, ExternalLink, DollarSign } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getPurchases, getCustomers, createPurchase, deletePurchase, updatePurchase } from '../../services/servicenow'
import type { CustomerPurchase } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import PurchaseFormWithCustomer from './PurchaseFormWithCustomer'

const statusVariant: Record<string, 'green' | 'yellow' | 'red'> = {
  completed: 'green',
  pending: 'yellow',
  cancelled: 'red',
}

export default function PurchaseList() {
  const { credentials } = useAuth()
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editPurchase, setEditPurchase] = useState<CustomerPurchase | null>(null)

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => getPurchases(credentials!),
    enabled: !!credentials,
  })

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(credentials!),
    enabled: !!credentials,
  })

  const createMut = useMutation({
    mutationFn: (data: Partial<CustomerPurchase>) => createPurchase(credentials!, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchases'] }); setModalOpen(false) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerPurchase> }) =>
      updatePurchase(credentials!, id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchases'] }); setModalOpen(false); setEditPurchase(null) },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deletePurchase(credentials!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchases'] }),
  })

  const filtered = purchases.filter(p => {
    const matchSearch = [p.u_product_name, p.u_customer_display].some(f =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
    const matchStatus = statusFilter === 'all' || p.u_status === statusFilter
    return matchSearch && matchStatus
  })

  const totalRevenue = filtered
    .filter(p => p.u_status === 'completed')
    .reduce((s, p) => s + parseFloat(p.u_amount || '0'), 0)

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center py-4">
          <p className="text-xl font-bold text-slate-900">{purchases.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total Orders</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-xl font-bold text-emerald-600">
            RM {purchases.filter(p => p.u_status === 'completed').reduce((s, p) => s + parseFloat(p.u_amount || '0'), 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Total Revenue</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-xl font-bold text-amber-600">
            {purchases.filter(p => p.u_status === 'pending').length}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input-field pl-9" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select
          className="input-field w-36"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn-primary" onClick={() => { setEditPurchase(null); setModalOpen(true) }}>
          <Plus className="w-4 h-4" /> Add Order
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ShoppingCart}
            title="No orders found"
            description="Add a purchase order to get started."
            action={
              <button className="btn-primary" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4" /> Add Order
              </button>
            }
          />
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Product / Service</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.sys_id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/customers/${p.u_customer}`} className="text-brand-600 hover:underline font-medium flex items-center gap-1">
                      {p.u_customer_display || '—'}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-800">{p.u_product_name}</td>
                  <td className="px-6 py-4 text-slate-500 hidden md:table-cell">
                    {p.u_purchase_date ? new Date(p.u_purchase_date).toLocaleDateString('en-MY') : '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-900">
                    RM {parseFloat(p.u_amount || '0').toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <Badge label={p.u_status} variant={statusVariant[p.u_status] ?? 'slate'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditPurchase(p); setModalOpen(true) }}
                        className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => { if (confirm('Delete this order?')) deleteMut.mutate(p.sys_id) }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">{filtered.length} records</span>
            <span className="text-xs font-medium text-slate-600">
              Showing revenue: <span className="text-emerald-600">RM {totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
            </span>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditPurchase(null) }}
        title={editPurchase ? 'Edit Order' : 'New Purchase Order'}
      >
        <PurchaseFormWithCustomer
          initial={editPurchase ?? undefined}
          customers={customers}
          onSubmit={data => {
            if (editPurchase) {
              updateMut.mutate({ id: editPurchase.sys_id, data })
            } else {
              createMut.mutate(data)
            }
          }}
          onCancel={() => { setModalOpen(false); setEditPurchase(null) }}
          loading={createMut.isPending || updateMut.isPending}
        />
      </Modal>
    </div>
  )
}
