import { getDatabase } from "../config/database.js";
import EmergencyTrip from "../models/EmergencyTrip.js";

const emergencyTripService = {
  async createTrip({
    emergencyRequestId,
    emergencyDate,
    emergencyStartTime,
    patientLatitude,
    patientLongitude,
    hospitalName,
    hospitalAddress,
    hospitalLatitude,
    hospitalLongitude,
    hospitalRating,
    ambulanceStartTime
  }) {
    const db = getDatabase();

    const [result] = await db.query(
      `INSERT INTO emergency_trips
      (
        emergency_request_id,
        emergency_date,
        emergency_start_time,
        patient_latitude,
        patient_longitude,
        hospital_name,
        hospital_address,
        hospital_latitude,
        hospital_longitude,
        hospital_rating,
        ambulance_start_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        emergencyRequestId || null,
        emergencyDate,
        emergencyStartTime,
        patientLatitude,
        patientLongitude,
        hospitalName,
        hospitalAddress || null,
        hospitalLatitude,
        hospitalLongitude,
        hospitalRating || null,
        ambulanceStartTime || null
      ]
    );

    return this.getTripById(
      result.insertId
    );
  },

  async getTripById(id) {
    const db = getDatabase();

    const [rows] = await db.query(
      `SELECT *
       FROM emergency_trips
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return new EmergencyTrip(rows[0]);
  },

  async updateTrip(id, updates) {
    const db = getDatabase();

    const fields = [];
    const values = [];

    const allowedFields = [
      "ambulance_start_time",
      "patient_reached_time",
      "hospital_reached_time",
      "ambulance_to_patient_distance",
      "ambulance_to_patient_eta",
      "patient_to_hospital_distance",
      "patient_to_hospital_eta",
      "status",
      "emergency_end_time"
    ];

    allowedFields.forEach(
      (field) => {
        if (
          updates[field] !== undefined
        ) {
          fields.push(
            `${field} = ?`
          );

          values.push(
            updates[field]
          );
        }
      }
    );

    if (fields.length === 0) {
      return this.getTripById(id);
    }

    values.push(id);

    await db.query(
      `UPDATE emergency_trips
       SET ${fields.join(", ")}
       WHERE id = ?`,
      values
    );

    return this.getTripById(id);
  },

  async getAllTrips() {
    const db = getDatabase();

    const [rows] = await db.query(
      `SELECT *
       FROM emergency_trips
       ORDER BY created_at DESC`
    );

    return rows.map(
      (row) =>
        new EmergencyTrip(row)
    );
  }
};

export default emergencyTripService;