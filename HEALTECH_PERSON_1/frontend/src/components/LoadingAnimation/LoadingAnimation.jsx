import './LoadingAnimation.css'

const LoadingAnimation = ({ label = 'Loading...' }) => (
  <div className="loading-wrap">
    <div className="spinner" />
    <span>{label}</span>
  </div>
)

export default LoadingAnimation
