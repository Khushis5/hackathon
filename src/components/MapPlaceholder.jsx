import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapPlaceholder.css'

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const attackLocations = [
  { lat: 40.7128, lng: -74.0060, city: 'New York', attacks: 8, status: 'Active' },
  { lat: 37.7749, lng: -122.4194, city: 'San Francisco', attacks: 5, status: 'Monitoring' },
  { lat: 51.5074, lng: -0.1278, city: 'London', attacks: 12, status: 'High Risk' },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo', attacks: 3, status: 'Low Risk' },
  { lat: -33.8688, lng: 151.2093, city: 'Sydney', attacks: 6, status: 'Monitoring' },
]

export default function MapPlaceholder() {
  return (
    <section className="map-placeholder">
      <h3>Real-time Attack Locations</h3>
      <div className="map-container">
        <MapContainer center={[20, 0]} zoom={2} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {attackLocations.map((location, idx) => (
            <Marker key={idx} position={[location.lat, location.lng]}>
              <Popup>
                <div className="popup-content">
                  <h4>{location.city}</h4>
                  <p>Attacks: {location.attacks}</p>
                  <p>Status: <strong>{location.status}</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="map-legend">
        <div className="legend-item"><span className="active"></span> Active Attacks</div>
        <div className="legend-item"><span className="warning"></span> High Risk</div>
        <div className="legend-item"><span className="safe"></span> Low Risk</div>
      </div>
    </section>
  )
}
