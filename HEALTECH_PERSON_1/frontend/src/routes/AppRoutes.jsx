import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

import Splash from '../pages/Splash/Splash.jsx'
import Login from '../pages/Login/Login.jsx'
import NormalSearch from '../pages/NormalSearch/NormalSearch.jsx'
import HospitalDetails from '../pages/HospitalDetails/HospitalDetails.jsx'
import NearbyHospitals from '../pages/NearbyHospitals/NearbyHospitals.jsx'
import AIHealthBuddy from '../pages/AIHealthBuddy/AIHealthBuddy.jsx'
import AmbulanceBooking from '../pages/AmbulanceBooking/AmbulanceBooking.jsx'

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Splash />} />
    <Route path="/login" element={<Login />} />
    <Route path="/search" element={<RequireAuth><NormalSearch /></RequireAuth>} />
    <Route path="/hospital/:placeId" element={<RequireAuth><HospitalDetails /></RequireAuth>} />
    <Route path="/nearby-hospitals" element={<RequireAuth><NearbyHospitals /></RequireAuth>} />
    <Route path="/ai-health-buddy" element={<RequireAuth><AIHealthBuddy /></RequireAuth>} />
    <Route path="/ambulance-booking" element={<RequireAuth><AmbulanceBooking /></RequireAuth>} />
  </Routes>
)

export default AppRoutes
