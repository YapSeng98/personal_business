import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import icon2x from 'leaflet/dist/images/marker-icon-2x.png'

let patched = false

export function fixLeafletIcons() {
  if (patched) return
  patched = true
  // @ts-expect-error — Leaflet's Icon.Default private field, standard Vite bundling fix
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: icon2x,
    iconUrl: icon,
    shadowUrl: iconShadow,
  })
}
