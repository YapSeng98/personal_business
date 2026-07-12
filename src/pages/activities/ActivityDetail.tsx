import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  X, ChevronLeft, ChevronRight, MapPin, Tag, Users, UserPlus,
  CheckCircle2, Clock, Edit2, Trash2, Calendar as CalendarIcon,
  GraduationCap, Rocket, UserCheck, PartyPopper, Award, CalendarDays,
  MessageCircle, Dumbbell, Trophy, Heart,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getPartnerActivities, getPartners, createPartnerActivity,
  updatePartnerActivity, deletePartnerActivity,
} from '../../services/servicenow'
import type { Activity } from '../../types'
import Badge from '../../components/ui/Badge'
import ActivityMap from './ActivityMap'
import { whatsappLink, activityInviteMessage } from '../../lib/whatsapp'
import { matchPartnersToActivity } from '../../lib/partnerMatching'

const categoryConfig: Record<string, { icon: React.ElementType; gradient: string; pill: string; border: string }> = {
  Meeting: { icon: Users, gradient: 'from-blue-50 to-white', pill: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  Training: { icon: GraduationCap, gradient: 'from-violet-50 to-white', pill: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  'Product Launch': { icon: Rocket, gradient: 'from-amber-50 to-white', pill: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  Recruiting: { icon: UserCheck, gradient: 'from-emerald-50 to-white', pill: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  Social: { icon: PartyPopper, gradient: 'from-pink-50 to-white', pill: 'bg-pink-100 text-pink-700', border: 'border-pink-200' },
  Recognition: { icon: Award, gradient: 'from-yellow-50 to-white', pill: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200' },
  Workout: { icon: Dumbbell, gradient: 'from-cyan-50 to-white', pill: 'bg-cyan-100 text-cyan-700', border: 'border-cyan-200' },
  Sport: { icon: Trophy, gradient: 'from-teal-50 to-white', pill: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
  Wellness: { icon: Heart, gradient: 'from-pink-50 to-white', pill: 'bg-pink-100 text-pink-700', border: 'border-pink-200' },
  Other: { icon: CalendarDays, gradient: 'from-indigo-50 to-white', pill: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200' },
}

const confirmVariant: Record<string, 'green' | 'red' | 'yellow'> = {
  confirmed: 'green',
  declined: 'red',
  pending: 'yellow',
}

export default function ActivityDetail({
  activity, onClose, onPrev, onNext, hasPrev, hasNext, index, total, onEdit, onDelete,
}: {
  activity: Activity
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
  const cfg = categoryConfig[activity.u_category] ?? categoryConfig.Other
  const Icon = cfg.icon

  const { data: links = [] } = useQuery({
    queryKey: ['partnerActivities', 'byActivity', activity.sys_id],
    queryFn: () => getPartnerActivities(credentials!, { activityId: activity.sys_id }),
    enabled: !!credentials,
  })

  const { data: partners = [] } = useQuery({
    queryKey: ['partners'],
    queryFn: () => getPartners(credentials!),
    enabled: !!credentials,
  })

  const inviteMut = useMutation({
    mutationFn: (partnerId: string) => createPartnerActivity(credentials!, {
      u_partner: partnerId,
      u_activity: activity.sys_id,
      u_interested: 'interested',
      u_confirmed: 'pending',
      u_role_in_activity: 'Attendee',
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partnerActivities', 'byActivity', activity.sys_id] }),
  })

  const confirmMut = useMutation({
    mutationFn: ({ id, u_confirmed }: { id: string; u_confirmed: string }) =>
      updatePartnerActivity(credentials!, id, { u_confirmed: u_confirmed as 'confirmed' | 'declined' | 'pending' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partnerActivities', 'byActivity', activity.sys_id] }),
  })

  const removeMut = useMutation({
    mutationFn: (id: string) => deletePartnerActivity(credentials!, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['partnerActivities', 'byActivity', activity.sys_id] }),
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

  const linkedIds = new Set(links.map(l => l.u_partner))
  const suggestions = matchPartnersToActivity(activity, partners, linkedIds)
  const tags = activity.u_tags ? activity.u_tags.split(/[,;]/).map(t => t.trim()).filter(Boolean) : []

  const phoneOf = (partnerId: string) => partners.find(p => p.sys_id === partnerId)?.u_phone

  // Open a pre-filled WhatsApp invite (date/time/location) for this partner.
  function openWhatsApp(phone: string | undefined, partnerName?: string) {
    const link = whatsappLink(phone, activityInviteMessage({
      partnerName,
      title: activity.u_title,
      date: activity.u_activity_date,
      time: activity.u_activity_time,
      address: activity.u_address,
    }))
    if (link) window.open(link, '_blank', 'noopener')
  }

  // Suggested-partner Invite: fire the WhatsApp invite first (sync, avoids
  // popup blocking) then record the invitation.
  function handleInvite(partner: { sys_id: string; u_name: string; u_phone: string }) {
    openWhatsApp(partner.u_phone, partner.u_name)
    inviteMut.mutate(partner.sys_id)
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] lg:w-[580px] flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className={`shrink-0 bg-gradient-to-br ${cfg.gradient} border-b ${cfg.border}`}>
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <button onClick={onPrev} disabled={!hasPrev} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 ring-1 ring-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-4 h-4 text-white/85" />
              </button>
              <span className="text-xs font-medium text-slate-500 tabular-nums">{index + 1} / {total}</span>
              <button onClick={onNext} disabled={!hasNext} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 ring-1 ring-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-4 h-4 text-white/85" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onEdit} aria-label="Edit" className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 ring-1 ring-white/15 transition-all">
                <Edit2 className="w-3.5 h-3.5 text-white/85" />
              </button>
              <button onClick={onDelete} aria-label="Delete" className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/25 ring-1 ring-white/15 transition-all">
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
              <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 ring-1 ring-white/15 transition-all">
                <X className="w-4 h-4 text-white/85" />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 px-5 pb-5">
            <div className={`w-12 h-12 rounded-2xl ${cfg.pill} flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{activity.u_title}</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.pill}`}>{activity.u_category}</span>
                <Badge label={activity.u_status} variant={activity.u_status === 'completed' ? 'green' : activity.u_status === 'cancelled' ? 'red' : 'blue'} />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              {activity.u_activity_date}
              {activity.u_activity_time && <span> · {activity.u_activity_time}</span>}
            </div>

            {activity.u_description && (
              <p className="text-sm text-slate-600 leading-relaxed">{activity.u_description}</p>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    <Tag className="w-3 h-3" />{t}
                  </span>
                ))}
              </div>
            )}

            {/* Location + map */}
            {activity.u_address && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
                  <MapPin className="w-4 h-4 text-red-500" />Location
                </h3>
                <p className="text-sm text-slate-600 mb-2">{activity.u_address}</p>
                <ActivityMap
                  address={activity.u_address}
                  lat={activity.u_lat}
                  lng={activity.u_lng}
                  label={activity.u_title}
                />
              </div>
            )}

            {/* Linked partners */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                <Users className="w-4 h-4 text-blue-500" />Invited Partners ({links.length})
              </h3>
              {links.length === 0 ? (
                <p className="text-sm text-slate-400">No partners invited yet.</p>
              ) : (
                <div className="space-y-2">
                  {links.map(l => (
                    <div key={l.sys_id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{l.u_partner_display || 'Unknown partner'}</p>
                        <p className="text-xs text-slate-400">{l.u_role_in_activity || 'Attendee'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge label={l.u_confirmed} variant={confirmVariant[l.u_confirmed] ?? 'yellow'} />
                        {whatsappLink(phoneOf(l.u_partner)) && (
                          <button className="w-7 h-7 rounded-full hover:bg-emerald-500/20 flex items-center justify-center transition-colors" title="Message on WhatsApp" onClick={() => openWhatsApp(phoneOf(l.u_partner), l.u_partner_display)}>
                            <MessageCircle className="w-4 h-4 text-emerald-400" />
                          </button>
                        )}
                        {l.u_confirmed !== 'confirmed' && (
                          <button className="w-7 h-7 rounded-full hover:bg-emerald-50 flex items-center justify-center transition-colors" title="Mark confirmed" onClick={() => confirmMut.mutate({ id: l.sys_id, u_confirmed: 'confirmed' })}>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </button>
                        )}
                        {l.u_confirmed !== 'pending' && (
                          <button className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors" title="Mark pending" onClick={() => confirmMut.mutate({ id: l.sys_id, u_confirmed: 'pending' })}>
                            <Clock className="w-4 h-4 text-slate-400" />
                          </button>
                        )}
                        <button className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors" title="Remove" onClick={() => removeMut.mutate(l.sys_id)}>
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested partners */}
            {suggestions.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                  <UserPlus className="w-4 h-4 text-emerald-500" />Suggested Partners
                </h3>
                <div className="space-y-2">
                  {suggestions.map(({ partner, matchedTags }) => {
                    const hasPhone = !!whatsappLink(partner.u_phone)
                    return (
                      <div key={partner.sys_id} className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{partner.u_name}</p>
                          {matchedTags.length > 0 && (
                            <p className="text-xs text-emerald-700 truncate">Matches: {matchedTags.join(', ')}</p>
                          )}
                        </div>
                        <button
                          className={`py-1 px-2.5 text-xs shrink-0 rounded-xl font-medium flex items-center gap-1.5 transition-colors ${
                            hasPhone
                              ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/25 hover:bg-emerald-500/25'
                              : 'btn-secondary'
                          }`}
                          onClick={() => handleInvite(partner)}
                          disabled={inviteMut.isPending}
                          title={hasPhone ? 'Invite via WhatsApp' : 'Invite (no phone on file)'}
                        >
                          {hasPhone ? <MessageCircle className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                          Invite
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="h-2" />
          </div>
        </div>
      </div>
    </>
  )
}
