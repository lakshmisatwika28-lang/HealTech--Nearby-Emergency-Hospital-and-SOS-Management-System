import HospitalCard from '../HospitalCard/HospitalCard.jsx'
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation.jsx'
import './HospitalList.css'

const HospitalList = ({ hospitals, loading, emptyText = 'No hospitals found' }) => {
  if (loading) return <LoadingAnimation />
  if (!hospitals || hospitals.length === 0) {
    return <p className="hospital-list-empty">{emptyText}</p>
  }
  return (
    <div className="hospital-list">
      {hospitals.map((h) => (
        <HospitalCard key={h.id} hospital={h} />
      ))}
    </div>
  )
}

export default HospitalList
