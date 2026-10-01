import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { bookAmbulance } from '../../services/ambulanceService.js'
import './AmbulanceBooking.css'

const AmbulanceBooking = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const hospital = state?.hospital
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  if (!hospital) {
    return (
      <div className="container">
        <p>No hospital selected. Go to Nearby Hospitals and pick one first.</p>
        <button className="btn-primary" onClick={() => navigate('/nearby-hospitals')}>Nearby Hospitals</button>
      </div>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('booking')
    try {
      await bookAmbulance({ hospitalId: hospital.id, hospitalName: hospital.name, date, time })
      setStatus('confirmed')
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed')
      setStatus('idle')
    }
  }

  if (status === 'confirmed') {
    return (
      <div className="container ambulance-confirmed">
        <h2>Ambulance Booked ✅</h2>
        <p>{hospital.name} • {date} • {time}</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Book Ambulance</h2>
      <p className="ambulance-hospital">{hospital.name}</p>
      <form className="card ambulance-form" onSubmit={submit}>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input className="input" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        {error && <p className="ambulance-error">{error}</p>}
        <button className="btn-primary" disabled={status === 'booking'}>
          {status === 'booking' ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  )
}

export default AmbulanceBooking
