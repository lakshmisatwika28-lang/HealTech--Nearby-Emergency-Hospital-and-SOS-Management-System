import * as maps from '../integrations/google/mapsService.js'
import * as directions from '../integrations/google/directionsService.js'

export const getStaticMap = (lat, lng) => maps.buildStaticMapUrl(lat, lng)

export const getETA = (originLat, originLng, destLat, destLng) =>
  directions.getRouteAndETA(originLat, originLng, destLat, destLng)
