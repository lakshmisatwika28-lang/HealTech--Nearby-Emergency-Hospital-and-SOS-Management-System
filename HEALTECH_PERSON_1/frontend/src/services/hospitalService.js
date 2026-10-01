import api from './apiClient.js'

export const searchHospitals = (query, lat, lng) =>
  api.get('/hospitals/search', { params: { query, lat, lng } }).then((r) => r.data.data)

export const getNearbyHospitals = (lat, lng, radius) =>
  api.get('/hospitals/nearby', { params: { lat, lng, radius } }).then((r) => r.data.data)

export const getHospitalById = (placeId, lat, lng) =>
  api.get(`/hospitals/${placeId}`, { params: { lat, lng } }).then((r) => r.data.data)
