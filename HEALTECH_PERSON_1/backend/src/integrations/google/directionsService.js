import axios from 'axios'
import { ENV } from '../../config/env.js'

export const getRouteAndETA = async (originLat, originLng, destLat, destLng) => {
  const params = {
    origin: `${originLat},${originLng}`,
    destination: `${destLat},${destLng}`,
    key: ENV.GOOGLE_MAPS_API_KEY
  }
  const { data } = await axios.get('https://maps.googleapis.com/maps/api/directions/json', { params })
  if (data.status !== 'OK') throw new Error(`Directions error: ${data.status}`)
  const leg = data.routes[0]?.legs[0]
  if (!leg) return null
  return {
    distanceText: leg.distance?.text,
    distanceMeters: leg.distance?.value,
    durationText: leg.duration?.text,
    durationSeconds: leg.duration?.value,
    polyline: data.routes[0]?.overview_polyline?.points || null
  }
}
