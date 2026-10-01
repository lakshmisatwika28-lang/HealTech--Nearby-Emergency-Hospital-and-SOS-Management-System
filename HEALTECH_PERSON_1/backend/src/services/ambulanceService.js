import AmbulanceBooking from '../models/AmbulanceBooking.js'

export const createBooking = async ({ userId, hospitalId, hospitalName, date, time }) => {
  const booking = await AmbulanceBooking.create({
    userId, hospitalId, hospitalName, date, time, type: 'normal', status: 'pending'
  })
  return booking
}

export const checkAvailability = async (hospitalId, date, time) => {
  const existing = await AmbulanceBooking.countDocuments({ hospitalId, date, time, status: { $ne: 'cancelled' } })
  return existing < 3
}

export const confirmBooking = async (bookingId) => {
  return AmbulanceBooking.findByIdAndUpdate(bookingId, { status: 'confirmed' }, { new: true })
}

export const getUserBookings = async (userId) => {
  return AmbulanceBooking.find({ userId }).sort({ createdAt: -1 })
}
