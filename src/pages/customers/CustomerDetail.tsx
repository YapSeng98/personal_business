import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Plus, Trash2, Building2, Phone, Mail, MapPin,
  FileText, ShoppingCart, DollarSign, Loader2, Network, CheckCircle2, Pencil,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getCustomer, updateCustomer, deleteCustomer,
  getPurchases, createPurchase, updatePurchase, deletePurchase,
  getPartners, createPartner,
} from '../../services/servicenow'
import type { Customer, CustomerPurchase } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import PurchaseForm from './PurchaseForm'
import CustomerForm from './CustomerForm'

const statusVariant: Record<string, 'green' | 'yellow' | 'red'> = {
  completed: 'green',
  pending: 'yellow',
  cancelled: 'red',
}

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const { credentials } = useAuth()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const [purchaseModal, setPurchaseModal] = useState(false)
  const [editPurchase, setEditPurchase] = useState<CustomerPurchase | null>(null)
  const [customerModal, setCustomerModal] = useState(false)

  const { data: customer, isLoading: loadingCustomer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomer(credentials!, id!),
    enabled: !!credentials && !!id,
  })

  const { data: purchases = [], isLoading: loadingPurchases } = useQuery({
    queryKey: ['purchases', id],
    queryFn: () => getPurchases(credentials!, id),
    enabled: !!credentials && !!id,
  })

  const { data: partners = [] } = useQuery({
    queryKey: ['partners'],
    queryFn: () => getPartners(credentials!),
    enabled: !!credentials,
  })

  // Partner record already linked to this customer (if converted before)
  const linkedPartner = partners.find(p => p.u_customer === id)

  const convertMut = useMutation({
    mutationFn: () => createPartner(credentials!, {
      u_name: customer!.u_name,
      u_email: customer!.u_email,
      u_phone: customer!.u_phone,
      u_notes: customer!.u_notes,
      u_status: 'prospect',
      u_network_position: 'prospect',
      u_customer: id,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partners'] })
      navigate('/partners')
    },
  })

  const deleteCustMut = useMutation({
    mutationFn: () => deleteCustomer(credentials!, id!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); navigate('/customers') },
  })

  const updateCustMut = useMutation({
    mutationFn: (data: Partial<Customer>) => updateCustomer(credentials!, id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer', id] })
      qc.invalidateQueries({ queryKey: ['customers'] })
      setCustomerModal(false)
    },
  })

  const createPurchaseMut = useMutation({
    mutationFn: (data: Partial<CustomerPurchase>) =>
      createPurchase(credentials!, { ...data, u_customer: id }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchases', id] }); setPurchaseModal(false) },
  })

  const updatePurchaseMut = useMutation({
    mutationFn: ({ sid, data }: { sid: string; data: Partial<CustomerPurchase> }) =>
      updatePurchase(credentials!, sid, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['purchases', id] }); setPurchaseModal(false); setEditPurchase(null) },
  })

  const deletePurchaseMut = useMutation({
    mutationFn: (sid: string) => deletePurchase(credentials!, sid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchases', id] }),
  })

  const totalRevenue = purchases
    .filter(p => p.u_status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.u_amount || '0'), 0)

  if (loadingCustomer) return <LoadingSpinner />

  if (!customer) return (
    <div className="card text-center py-12">
      <p className="text-slate-400">Customer not found.</p>
      <Link to="/customers" className="btn-secondary mt-4 inline-flex">Back to Customers</Link>
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link to="/customers" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </Link>

      {/* Customer header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl shrink-0">
              {customer.u_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{customer.u_name}</h2>
              {customer.u_company && (
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />{customer.u_company}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="btn-secondary" onClick={() => setCustomerModal(true)}>
              <Pencil className="w-4 h-4" /> Edit
            </button>
            {linkedPartner ? (
              <Link to="/partners" className="btn-secondary text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                <CheckCircle2 className="w-4 h-4" /> Partner ✓
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (confirm(`Convert ${customer.u_name} into a partner? Their contact details will be copied to a new partner record linked to this customer.`)) {
                    convertMut.mutate()
                  }
                }}
                className="btn-primary"
                disabled={convertMut.isPending}
              >
                {convertMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
                Convert to Partner
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Delete this customer?')) deleteCustMut.mutate()
              }}
              className="btn-danger"
              disabled={deleteCustMut.isPending}
            >
              {deleteCustMut.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          {customer.u_email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <a href={`mailto:${customer.u_email}`} className="text-brand-600 hover:underline truncate">{customer.u_email}</a>
            </div>
          )}
          {customer.u_phone && (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />{customer.u_phone}
            </div>
          )}
          {customer.u_address && (
            <div className="flex items-center gap-2 text-sm text-slate-700 col-span-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />{customer.u_address}
            </div>
          )}
          {customer.u_notes && (
            <div className="flex items-start gap-2 text-sm text-slate-700 col-span-2 md:col-span-4">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />{customer.u_notes}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-slate-900">{purchases.length}</p>
          <p className="text-xs text-slate-400 mt-1">Total Orders</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-emerald-600">
            RM {totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-400 mt-1">Total Revenue</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-amber-600">
            {purchases.filter(p => p.u_status === 'pending').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Pending Orders</p>
        </div>
      </div>

      {/* Purchases */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-wrap gap-2">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-slate-400" /> Purchase History
          </h3>
          <button className="btn-primary" onClick={() => { setEditPurchase(null); setPurchaseModal(true) }}>
            <Plus className="w-4 h-4" /> Add Purchase
          </button>
        </div>

        {loadingPurchases ? (
          <LoadingSpinner />
        ) : purchases.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <DollarSign className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No purchase records yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Product / Service</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:table-cell">Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchases.map(p => (
                <tr key={p.sys_id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-3.5">
                    <p className="font-medium text-slate-900">{p.u_product_name}</p>
                    {p.u_notes && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.u_notes}</p>}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 hidden sm:table-cell">
                    {p.u_purchase_date ? new Date(p.u_purchase_date).toLocaleDateString('en-MY') : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-slate-900">
                    RM {parseFloat(p.u_amount || '0').toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge label={p.u_status} variant={statusVariant[p.u_status] ?? 'slate'} />
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditPurchase(p); setPurchaseModal(true) }}
                        className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button
                        onClick={() => { if (confirm('Delete this purchase?')) deletePurchaseMut.mutate(p.sys_id) }}
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
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <Modal
        open={purchaseModal}
        onClose={() => { setPurchaseModal(false); setEditPurchase(null) }}
        title={editPurchase ? 'Edit Purchase' : 'New Purchase'}
      >
        <PurchaseForm
          initial={editPurchase ?? undefined}
          onSubmit={data => {
            if (editPurchase) {
              updatePurchaseMut.mutate({ sid: editPurchase.sys_id, data })
            } else {
              createPurchaseMut.mutate(data)
            }
          }}
          onCancel={() => { setPurchaseModal(false); setEditPurchase(null) }}
          loading={createPurchaseMut.isPending || updatePurchaseMut.isPending}
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal open={customerModal} onClose={() => setCustomerModal(false)} title="Edit Customer">
        <CustomerForm
          initial={customer}
          onSubmit={data => updateCustMut.mutate(data)}
          onCancel={() => setCustomerModal(false)}
          loading={updateCustMut.isPending}
        />
      </Modal>
    </div>
  )
}
