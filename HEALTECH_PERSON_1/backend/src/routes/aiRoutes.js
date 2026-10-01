import { Router } from 'express'
import { suggestFromSymptoms, healthBuddyChat } from '../controllers/aiController.js'

const router = Router()

router.post('/suggest', suggestFromSymptoms)
router.post('/health-buddy', healthBuddyChat)

export default router
