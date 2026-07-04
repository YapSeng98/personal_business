export interface GeocodeResult {
  lat: string
  lng: string
}

const MIN_INTERVAL_MS = 1100
let lastRequestAt = 0

async function throttle(): Promise<void> {
  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now()
  if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
  lastRequestAt = Date.now()
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!address.trim()) return null
  await throttle()
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const results = await res.json()
    if (!Array.isArray(results) || results.length === 0) return null
    const { lat, lon } = results[0]
    if (!lat || !lon) return null
    return { lat, lng: lon }
  } catch {
    return null
  }
}
