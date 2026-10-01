import { Router } from 'express'
import { searchHospitals, getNearbyHospitals, getHospitalById } from '../controllers/hospitalController.js'

const router = Router()

router.get('/search', searchHospitals)
router.get('/nearby', getNearbyHospitals)
router.get('/:placeId', getHospitalById)

export default router
