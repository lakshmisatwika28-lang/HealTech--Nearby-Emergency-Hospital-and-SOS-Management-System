import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Rating from '../../components/Rating/Rating.jsx'
import HospitalMap from '../../components/HospitalMap/HospitalMap.jsx'
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation.jsx'
import { getHospitalById } from '../../services/hospitalService.js'
import { getCurrentPosition } from '../../services/mapService.js'
import './HospitalDetails.css'

const HospitalDetails = () => {
  const { placeId } = useParams()
  const navigate = useNavigate()
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let coords = {}
    getCurrentPosition()
      .then((c) => { coords = c })
      .catch(() => {})
      .finally(() => {
        getHospitalById(placeId, coords.lat, coords.lng)
          .then(setHospital)
          .finally(() => setLoading(false))
      })
  }, [placeId])

  if (loading) return <LoadingAnimation />
  if (!hospital) return <p className="container">Hospital not found</p>

  return (
    <div className="container hospital-details">
      <img
        src={hospital.photo || '/images/hospitals/placeholder.png'}
        alt={hospital.name}
        className="hospital-details-img"
      />
      <h2>{hospital.name}</h2>
      <Rating value={hospital.rating} total={hospital.userRatingsTotal} />
      <p className="hospital-details-address">{hospital.address}</p>

      <div className="hospital-details-actions">
        {hospital.phone && <a className="btn-primary" href={`tel:${hospital.phone}`}>Call Hospital</a>}
        <button className="btn-primary" onClick={() => navigate('/ambulance-booking', { state: { hospital } })}>
          Book Ambulance
        </button>
      </div>

      {(hospital.distance || hospital.eta) && (
        <div className="hospital-details-meta">
          {hospital.distance && <span>Distance: {hospital.distance}</span>}
          {hospital.eta && <span>ETA: {hospital.eta}</span>}
        </div>
      )}

      <HospitalMap latitude={hospital.latitude} longitude={hospital.longitude} name={hospital.name} />
    </div>
  )
}

export default HospitalDetails
