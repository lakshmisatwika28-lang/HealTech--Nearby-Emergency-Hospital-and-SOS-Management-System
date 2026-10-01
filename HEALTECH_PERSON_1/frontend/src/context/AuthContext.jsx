import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, fetchMe } from '../services/authService.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('healtech_token')
    if (!token) {
      setLoading(false)
      return
    }
    fetchMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('healtech_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (phone, password) => {
    const { token, user } = await loginUser(phone, password)
    localStorage.setItem('healtech_token', token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('healtech_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
