import * as ambulanceService from '../services/ambulanceService.js'

export const bookAmbulance = async (req, res, next) => {
  try {
    const { hospitalId, hospitalName, date, time } = req.body
    if (!hospitalId || !hospitalName || !date || !time) {
      return res.status(400).json({ success: false, message: 'hospitalId, hospitalName, date and time are required' })
    }
    const available = await ambulanceService.checkAvailability(hospitalId, date, time)
    if (!available) {
      return res.status(409).json({ success: false, message: 'No ambulance available for that slot' })
    }
    const booking = await ambulanceService.createBooking({
      userId: req.user.userId, hospitalId, hospitalName, date, time
    })
    res.status(201).json({ success: true, data: booking })
  } catch (err) {
    next(err)
  }
}

export const confirmAmbulance = async (req, res, next) => {
  try {
    const booking = await ambulanceService.confirmBooking(req.params.bookingId)
    res.json({ success: true, data: booking })
  } catch (err) {
    next(err)
  }
}

export const myBookings = async (req, res, next) => {
  try {
    const bookings = await ambulanceService.getUserBookings(req.user.userId)
    res.json({ success: true, data: bookings })
  } catch (err) {
    next(err)
  }
}
