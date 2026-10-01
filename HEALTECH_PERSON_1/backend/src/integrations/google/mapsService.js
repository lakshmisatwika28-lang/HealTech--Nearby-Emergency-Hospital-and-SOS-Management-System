import axios from 'axios'
import { ENV } from '../../config/env.js'

export const geocodeAddress = async (address) => {
  const params = { address, key: ENV.GOOGLE_MAPS_API_KEY }
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', { params })
  if (data.status !== 'OK') throw new Error(`Geocoding error: ${data.status}`)
  const loc = data.results[0]?.geometry?.location
  return loc ? { latitude: loc.lat, longitude: loc.lng } : null
}

export const buildStaticMapUrl = (lat, lng, zoom = 15) => {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&markers=color:red%7C${lat},${lng}&key=${ENV.GOOGLE_MAPS_API_KEY}`
}
