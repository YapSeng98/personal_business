import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  X, ChevronLeft, ChevronRight, Mail, Phone, Users, Tag,
  StickyNote, Calendar as CalendarIcon, CheckCircle2, Clock, Edit2, Trash2,
  UserCheck, ExternalLink, MessageCircle,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getPartnerActivities, updatePartnerActivity } from '../../services/servicenow'
import type { Partner } from '../../types'
import Badge from '../../components/ui/Badge'
import { parseTags } from '../../lib/partnerMatching'
import { whatsappLink } from '../../lib/whatsapp'

const statusVariant: Record<string, 'green' | 'slate' | 'yellow'> = {
  active: 'green',
  inactive: 'slate',
  prospect: 'yellow',
}

const statusGradient: Record<string, string> = {
  active: 'from-emerald-50 to-white border-emerald-200',
  inactive: 'from-slate-50 to-white border-slate-200',
  prospect: 'from-amber-50 to-white border-amber-200',
}

const confirmVariant: Record<string, 'green' | 'red' | 'yellow'> = {
  confirmed: 'green',
  declined: 'red',
  pending: 'yellow',
}

export default function PartnerDetail({
  partner,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  index,
  total,
  onEdit,
  onDelete,
}: {
  partner: Partner
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
  index: number
  total: number
  onEdit: () => void
  onDelete: () => void
}) {
  const { credentials } = useAuth()
  const qc = useQueryClient()

  const { data: links = [] } = useQuery({
    queryKey: ['partnerActivities', partner.sys_id],
    queryFn: () => getPartnerActivities(credentials!, { partnerId: partner.sys_id }),
    enabled: !!credentials,
  })

  const confirmMut = useMutation({
    mutationFn: ({ id, u_confirmed }: { id: string; u_confirmed: string }) =>
      updatePartnerActivity(credentials!, id, { u_confirmed: u_confirmed as 'confirmed' | 'declined' | 'pending' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partnerActivities', partner.sys_id] }),
  })

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext) onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  const tags = parseTags(partner.u_interest_tags)
  const waLink = whatsappLink(partner.u_phone)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] lg:w-[580px] flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className={`shrink-0 bg-gradient-to-br ${statusGradient[partner.u_status] ?? statusGradient.prospect} border-b`}>
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <button onClick={onPrev} disabled={!hasPrev} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 ring-1 ring-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Previous partner">
                <ChevronLeft className="w-4 h-4 text-white/85" />
              </button>
              <span className="text-xs font-medium text-slate-500 tabular-nums">{index + 1} / {total}</span>
              <button onClick={onNext} disabled={!hasNext} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 ring-1 ring-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all" aria-label="Next partner">
                <ChevronRight className="w-4 h-4 text-white/85" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onEdit} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 ring-1 ring-white/15 transition-all" aria-label="Edit">
                <Edit2 className="w-3.5 h-3.5 text-white/85" />
              </button>
              <button onClick={onDelete} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/25 ring-1 ring-white/15 transition-all" aria-label="Delete">
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 ring-1 ring-white/15 transition-all" aria-label="Close">
                <X className="w-4 h-4 text-white/85" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5 pb-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
              {partner.u_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">{partner.u_name}</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge label={partner.u_status} variant={statusVariant[partner.u_status] ?? 'slate'} />
                {partner.u_account_type && <Badge label={partner.u_account_type} variant="purple" />}
                <Badge label={partner.u_network_position.replace('_', '-')} variant="blue" />
                {partner.u_rank && <Badge label={partner.u_rank} variant="purple" />}
                {!partner.u_sponsor && <Badge label="Unassigned" variant="yellow" />}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">
            {/* Contact */}
            <div className="space-y-2">
              {partner.u_email && (
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />{partner.u_email}
                </div>
              )}
              {partner.u_phone && (
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />{partner.u_phone}
                </div>
              )}
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-1 py-1.5 px-3 rounded-xl text-sm font-medium bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25 hover:bg-emerald-500/25 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Message on WhatsApp
                </a>
              )}
            </div>

            {/* Relationships */}
            <div className="flex gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 leading-relaxed">
                <p><span className="font-semibold">Sponsor:</span> {partner.u_sponsor_display || 'Unassigned'}</p>
                {partner.u_partner_of_display && (
                  <p className="mt-1"><span className="font-semibold">Partner's Partner:</span> {partner.u_partner_of_display}</p>
                )}
              </div>
            </div>

            {/* Linked customer record (converted from customer) */}
            {partner.u_customer && (
              <div className="flex gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <UserCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-900 leading-relaxed flex-1 min-w-0">
                  <p className="font-semibold">Converted from customer</p>
                  <Link
                    to={`/customers/${partner.u_customer}`}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:underline mt-0.5"
                    onClick={onClose}
                  >
                    {partner.u_customer_display || 'View customer record'}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Interest tags */}
            {tags.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                  <Tag className="w-4 h-4 text-slate-500" />Interest Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium capitalize">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {partner.u_notes && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                  <StickyNote className="w-4 h-4 text-amber-500" />Notes
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                  {partner.u_notes}
                </p>
              </div>
            )}

            {/* Linked activities */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                <CalendarIcon className="w-4 h-4 text-violet-500" />Activities ({links.length})
              </h3>
              {links.length === 0 ? (
                <p className="text-sm text-slate-400">Not linked to any activity yet.</p>
              ) : (
                <div className="space-y-2">
                  {links.map(l => (
                    <div key={l.sys_id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{l.u_activity_display || 'Untitled activity'}</p>
                        <p className="text-xs text-slate-400">{l.u_role_in_activity || 'Attendee'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge label={l.u_confirmed} variant={confirmVariant[l.u_confirmed] ?? 'yellow'} />
                        {l.u_confirmed !== 'confirmed' && (
                          <button
                            className="w-7 h-7 rounded-full hover:bg-emerald-50 flex items-center justify-center transition-colors"
                            title="Mark confirmed"
                            onClick={() => confirmMut.mutate({ id: l.sys_id, u_confirmed: 'confirmed' })}
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        {l.u_confirmed !== 'pending' && (
                          <button
                            className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                            title="Mark pending"
                            onClick={() => confirmMut.mutate({ id: l.sys_id, u_confirmed: 'pending' })}
                          >
                            <Clock className="w-4 h-4 text-slate-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-2" />
          </div>
        </div>
      </div>
    </>
  )
}
