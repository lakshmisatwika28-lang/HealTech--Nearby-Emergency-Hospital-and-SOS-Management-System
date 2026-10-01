import { getDatabase } from "../config/database.js";
import AmbulanceBooking from "../models/AmbulanceBooking.js";

const ambulanceService = {
  async createBooking({
    patientName,
    phone,
    bookingDate,
    bookingTime,
    pickupLatitude,
    pickupLongitude,
    destination,
    ambulanceType
  }) {
    const db = getDatabase();

    const [result] = await db.query(
      `INSERT INTO ambulance_bookings
      (
        patient_name,
        phone,
        booking_date,
        booking_time,
        pickup_latitude,
        pickup_longitude,
        destination,
        ambulance_type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientName,
        phone,
        bookingDate,
        bookingTime,
        pickupLatitude,
        pickupLongitude,
        destination,
        ambulanceType || "Basic"
      ]
    );

    return this.getBookingById(result.insertId);
  },

  async getBookingById(id) {
    const db = getDatabase();

    const [rows] = await db.query(
      `SELECT *
       FROM ambulance_bookings
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return new AmbulanceBooking(rows[0]);
  },

  async getAllBookings() {
    const db = getDatabase();

    const [rows] = await db.query(
      `SELECT *
       FROM ambulance_bookings
       ORDER BY created_at DESC`
    );

    return rows.map(
      (row) => new AmbulanceBooking(row)
    );
  },

  async updateBookingStatus(id, status) {
    const db = getDatabase();

    const [result] = await db.query(
      `UPDATE ambulance_bookings
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.getBookingById(id);
  },

  async cancelBooking(id) {
    return this.updateBookingStatus(
      id,
      "CANCELLED"
    );
  }
};

export default ambulanceService;