import api from './apiClient.js'

export const bookAmbulance = (payload) =>
  api.post('/ambulance/book', payload).then((r) => r.data.data)

export const getMyBookings = () =>
  api.get('/ambulance/my').then((r) => r.data.data)
