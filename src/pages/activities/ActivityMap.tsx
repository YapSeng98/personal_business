import { ExternalLink } from 'lucide-react'

// Google Maps via the keyless embed (no API key / billing). Prefers the
// address (Google geocodes it) and falls back to lat/lng.
export default function ActivityMap({ address, lat, lng, label }: {
  address?: string
  lat?: string
  lng?: string
  label: string
}) {
  const query = address?.trim()
    ? encodeURIComponent(address)
    : (lat && lng ? `${lat},${lng}` : '')
  if (!query) return null

  const embedSrc = `https://maps.google.com/maps?q=${query}&z=15&output=embed`
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${query}`

  return (
    <div>
      <div className="h-56 rounded-xl overflow-hidden border border-slate-200">
        <iframe
          title={label}
          src={embedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-2 text-xs text-brand-600 hover:underline"
      >
        <ExternalLink className="w-3.5 h-3.5" /> Open in Google Maps
      </a>
    </div>
  )
}
