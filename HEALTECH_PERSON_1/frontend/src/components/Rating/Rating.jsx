import './Rating.css'

const Rating = ({ value, total }) => {
  if (value == null) return <span className="rating rating-empty">No rating</span>
  return (
    <span className="rating">
      ⭐ {value.toFixed(1)}{total ? ` (${total})` : ''}
    </span>
  )
}

export default Rating
