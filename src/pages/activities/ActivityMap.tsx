import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { fixLeafletIcons } from '../../lib/leafletIconFix'

export default function ActivityMap({ lat, lng, label }: { lat: string; lng: string; label: string }) {
  useEffect(() => { fixLeafletIcons() }, [])

  const position: [number, number] = [parseFloat(lat), parseFloat(lng)]
  if (Number.isNaN(position[0]) || Number.isNaN(position[1])) return null

  return (
    <div className="h-56 rounded-xl overflow-hidden border border-slate-200">
      <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
