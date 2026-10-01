import axios from 'axios'
import { ENV } from '../../config/env.js'

const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place'

const normalizeHospital = (place) => ({
  id: place.place_id,
  name: place.name,
  rating: place.rating || null,
  address: place.vicinity || place.formatted_address || '',
  latitude: place.geometry?.location?.lat ?? null,
  longitude: place.geometry?.location?.lng ?? null,
  photo: place.photos?.[0]?.photo_reference
    ? `${PLACES_BASE}/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${ENV.GOOGLE_MAPS_API_KEY}`
    : null,
  openNow: place.opening_hours?.open_now ?? null,
  userRatingsTotal: place.user_ratings_total || 0
})

export const searchHospitalsByText = async (query, lat, lng) => {
  const params = {
    query: `${query} hospital`,
    key: ENV.GOOGLE_MAPS_API_KEY
  }
  if (lat && lng) {
    params.location = `${lat},${lng}`
    params.radius = 15000
  }
  const { data } = await axios.get(`${PLACES_BASE}/textsearch/json`, { params })
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places error: ${data.status}`)
  }
  return (data.results || []).map(normalizeHospital)
}

export const searchNearbyHospitals = async (lat, lng, radius = 5000) => {
  const params = {
    location: `${lat},${lng}`,
    radius,
    type: 'hospital',
    key: ENV.GOOGLE_MAPS_API_KEY
  }
  const { data } = await axios.get(`${PLACES_BASE}/nearbysearch/json`, { params })
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places error: ${data.status}`)
  }
  return (data.results || []).map(normalizeHospital)
}

export const getPlaceDetails = async (placeId) => {
  const params = {
    place_id: placeId,
    fields: 'name,rating,formatted_address,formatted_phone_number,geometry,photo,opening_hours,user_ratings_total,website',
    key: ENV.GOOGLE_MAPS_API_KEY
  }
  const { data } = await axios.get(`${PLACES_BASE}/details/json`, { params })
  if (data.status !== 'OK') {
    throw new Error(`Google Places details error: ${data.status}`)
  }
  const place = data.result
  return {
    ...normalizeHospital({ ...place, place_id: placeId }),
    phone: place.formatted_phone_number || null,
    website: place.website || null
  }
}
