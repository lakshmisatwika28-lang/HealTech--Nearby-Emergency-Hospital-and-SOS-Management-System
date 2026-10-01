import * as places from '../integrations/google/placesService.js'
import * as directions from '../integrations/google/directionsService.js'

export const findHospitals = async (query, lat, lng) => {
  const hospitals = await places.searchHospitalsByText(query, lat, lng)
  return sortByRating(hospitals)
}

export const findNearbyHospitals = async (lat, lng, radius) => {
  const hospitals = await places.searchNearbyHospitals(lat, lng, radius)
  const withDistance = await Promise.all(
    hospitals.map(async (h) => {
      if (h.latitude == null || h.longitude == null) return h
      try {
        const route = await directions.getRouteAndETA(lat, lng, h.latitude, h.longitude)
        return { ...h, distance: route?.distanceText || null, eta: route?.durationText || null }
      } catch {
        return h
      }
    })
  )
  return sortByRating(withDistance)
}

export const getHospitalDetails = async (placeId, userLat, userLng) => {
  const hospital = await places.getPlaceDetails(placeId)
  if (userLat && userLng && hospital.latitude != null) {
    const route = await directions.getRouteAndETA(userLat, userLng, hospital.latitude, hospital.longitude)
    hospital.distance = route?.distanceText || null
    hospital.eta = route?.durationText || null
  }
  return hospital
}

const sortByRating = (hospitals) =>
  [...hospitals].sort((a, b) => (b.rating || 0) - (a.rating || 0))
