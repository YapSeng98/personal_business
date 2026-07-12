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

// Emoji as \u{} escapes so the source stays pure ASCII (raw emoji bytes
// were getting mangled to replacement chars in transit). At runtime these
// are real emoji and encodeURIComponent() percent-encodes them correctly.
const E = {
  wave: '\u{1F44B}',      // 👋
  calendar: '\u{1F4C5}',  // 📅
  pin: '\u{1F4CD}',       // 📍
  clap: '\u{1F64C}',      // 🙌
}

export function activityInviteMessage(opts: {
  partnerName?: string
  title: string
  date: string
  time?: string
  allDay?: boolean
  address?: string
}): string {
  const when = opts.allDay
    ? ' (all day)'
    : (opts.time ? ' at ' + opts.time : '')
  const lines: string[] = [
    `Hi${opts.partnerName ? ' ' + opts.partnerName.split(' ')[0] : ''}! ${E.wave}`,
    '',
    `You're invited to *${opts.title}*.`,
    `${E.calendar} ${prettyDate(opts.date)}${when}`,
  ]
  if (opts.address) lines.push(`${E.pin} ${opts.address}`)
  lines.push('', `Hope to see you there! ${E.clap}`)
  return lines.join('\n')
}
