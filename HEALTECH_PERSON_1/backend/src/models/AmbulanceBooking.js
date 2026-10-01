import mongoose from 'mongoose'

const ambulanceBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: String, required: true },
  hospitalName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  type: { type: String, default: 'normal' }
}, { timestamps: true })

export default mongoose.model('AmbulanceBooking', ambulanceBookingSchema)
