import * as hospitalService from '../services/hospitalService.js'

export const searchHospitals = async (req, res, next) => {
  try {
    const { query, lat, lng } = req.query
    if (!query) return res.status(400).json({ success: false, message: 'query is required' })
    const hospitals = await hospitalService.findHospitals(query, lat, lng)
    res.json({ success: true, data: hospitals })
  } catch (err) {
    next(err)
  }
}

export const getNearbyHospitals = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query
    if (!lat || !lng) return res.status(400).json({ success: false, message: 'lat and lng are required' })
    const hospitals = await hospitalService.findNearbyHospitals(Number(lat), Number(lng), radius ? Number(radius) : undefined)
    res.json({ success: true, data: hospitals })
  } catch (err) {
    next(err)
  }
}

export const getHospitalById = async (req, res, next) => {
  try {
    const { placeId } = req.params
    const { lat, lng } = req.query
    const hospital = await hospitalService.getHospitalDetails(
      placeId,
      lat ? Number(lat) : null,
      lng ? Number(lng) : null
    )
    res.json({ success: true, data: hospital })
  } catch (err) {
    next(err)
  }
}
