// WhatsApp deep-linking. Normalizes local Malaysian numbers to the
// international wa.me format and composes invite messages.

const DEFAULT_CC = '60' // Malaysia

export function normalizePhone(raw: string | undefined): string | null {
  if (!raw) return null
  const digits = raw.replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('60')) return digits            // already international (MY)
  if (digits.startsWith('0')) return DEFAULT_CC + digits.slice(1) // 0123… → 60123…
  // bare local number → assume MY; otherwise trust an existing country code
  return digits.length <= 10 ? DEFAULT_CC + digits : digits
}

export function whatsappLink(phone: string | undefined, message?: string): string | null {
  const num = normalizePhone(phone)
  if (!num) return null
  const base = `https://wa.me/${num}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

function prettyDate(d: string): string {
  if (!d) return ''
  const parsed = new Date(d)
  if (Number.isNaN(parsed.getTime())) return d
  return parsed.toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function activityInviteMessage(opts: {
  partnerName?: string
  title: string
  date: string
  time?: string
  address?: string
}): string {
  const lines: string[] = [
    `Hi${opts.partnerName ? ' ' + opts.partnerName.split(' ')[0] : ''}! 👋`,
    '',
    `You're invited to *${opts.title}*.`,
    `🗓️ ${prettyDate(opts.date)}${opts.time ? ' · ' + opts.time : ''}`,
  ]
  if (opts.address) lines.push(`📍 ${opts.address}`)
  lines.push('', 'Hope to see you there! 🙌')
  return lines.join('\n')
}
