import { Router } from 'express'
import { bookAmbulance, confirmAmbulance, myBookings } from '../controllers/ambulanceController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/book', protect, bookAmbulance)
router.patch('/:bookingId/confirm', protect, confirmAmbulance)
router.get('/my', protect, myBookings)

export default router
