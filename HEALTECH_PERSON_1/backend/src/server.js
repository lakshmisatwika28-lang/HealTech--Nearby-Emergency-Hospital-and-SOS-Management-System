import express from 'express'
import cors from 'cors'
import { ENV } from './config/env.js'
import { connectDB } from './config/database.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import authRoutes from './routes/authRoutes.js'
import hospitalRoutes from './routes/hospitalRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import ambulanceRoutes from './routes/ambulanceRoutes.js'

const app = express()

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => res.json({ success: true, message: 'HEALTECH Person1 API running' }))

app.use('/api/auth', authRoutes)
app.use('/api/hospitals', hospitalRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/ambulance', ambulanceRoutes)

app.use(notFound)
app.use(errorHandler)

connectDB().then(() => {
  app.listen(ENV.PORT, () => console.log(`Server running on port ${ENV.PORT}`))
})
