import { useEffect, useState } from 'react'
import HospitalList from '../../components/HospitalList/HospitalList.jsx'
import { getNearbyHospitals } from '../../services/hospitalService.js'
import { getCurrentPosition } from '../../services/mapService.js'
import './NearbyHospitals.css'

const NearbyHospitals = () => {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCurrentPosition()
      .then(({ lat, lng }) => getNearbyHospitals(lat, lng))
      .then(setHospitals)
      .catch(() => setError('Could not access location. Enable GPS and retry.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container">
      <h2>Nearby Hospitals</h2>
      {error && <p className="nearby-error">{error}</p>}
      <HospitalList hospitals={hospitals} loading={loading} />
    </div>
  )
}

export default NearbyHospitals
