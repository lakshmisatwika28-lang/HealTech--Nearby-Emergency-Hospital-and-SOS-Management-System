import { staticMapUrl } from '../../services/mapService.js'
import './HospitalMap.css'

const HospitalMap = ({ latitude, longitude, name }) => {
  if (latitude == null || longitude == null) return null
  return (
    <div className="hospital-map">
      <img src={staticMapUrl(latitude, longitude)} alt={`Map for ${name}`} />
      <a
        className="hospital-map-link"
        href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in Google Maps
      </a>
    </div>
  )
}

export default HospitalMap
