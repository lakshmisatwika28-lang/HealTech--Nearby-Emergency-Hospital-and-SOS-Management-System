import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Splash.css'

const Splash = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/search' : '/login', { replace: true })
    }, 1500)
    return () => clearTimeout(timer)
  }, [loading, isAuthenticated, navigate])

  return (
    <div className="splash">
      <img src="/images/logo/logo.png" alt="HEALTECH" className="splash-logo" />
      <h1>HEALTECH</h1>
    </div>
  )
}

export default Splash
