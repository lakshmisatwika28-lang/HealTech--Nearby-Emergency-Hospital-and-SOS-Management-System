import { useNavigate } from 'react-router-dom'
import Rating from '../Rating/Rating.jsx'
import './HospitalCard.css'

const HospitalCard = ({ hospital }) => {
  const navigate = useNavigate()
  return (
    <div className="card hospital-card" onClick={() => navigate(`/hospital/${hospital.id}`)}>
      <img
        src={hospital.photo || '/images/hospitals/placeholder.png'}
        alt={hospital.name}
        className="hospital-card-img"
      />
      <div className="hospital-card-body">
        <h3>{hospital.name}</h3>
        <p className="hospital-card-address">{hospital.address}</p>
        <div className="hospital-card-meta">
          <Rating value={hospital.rating} total={hospital.userRatingsTotal} />
          {hospital.distance && <span>{hospital.distance}</span>}
          {hospital.eta && <span>{hospital.eta}</span>}
        </div>
      </div>
    </div>
  )
}

export default HospitalCard
