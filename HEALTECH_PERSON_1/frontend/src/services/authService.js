import api from './apiClient.js'

export const loginUser = (phone, password) =>
  api.post('/auth/login', { phone, password }).then((r) => r.data.data)

export const registerUser = (payload) =>
  api.post('/auth/register', payload).then((r) => r.data.data)

export const fetchMe = () => api.get('/auth/me').then((r) => r.data.data)
