import { getDatabase } from "../config/database.js";
import EmergencyRequest from "../models/EmergencyRequest.js";

const emergencyService = {
  async createEmergency({
    latitude,
    longitude,
    emergencyType
  }) {
    const db = getDatabase();

    const [result] = await db.query(
      `INSERT INTO emergency_requests
       (latitude, longitude, emergency_type, status)
       VALUES (?, ?, ?, 'ACTIVE')`,
      [
        latitude,
        longitude,
        emergencyType ||
          "General Emergency"
      ]
    );

    return this.getEmergencyById(
      result.insertId
    );
  },

  async getEmergencyById(id) {
    const db = getDatabase();

    const [rows] = await db.query(
      `SELECT
          e.*,

          t.id AS trip_id,
          t.hospital_name,
          t.hospital_address,
          t.hospital_latitude,
          t.hospital_longitude,
          t.hospital_rating,
          t.status AS trip_status,
          t.emergency_date,
          t.emergency_start_time,
          t.ambulance_start_time,
          t.patient_reached_time,
          t.hospital_reached_time,
          t.emergency_end_time

       FROM emergency_requests e

       LEFT JOIN emergency_trips t
         ON e.id =
            t.emergency_request_id

       WHERE e.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    return new EmergencyRequest(
      rows[0]
    );
  },

  async getAllEmergencies() {
    const db = getDatabase();

    const [rows] = await db.query(
      `SELECT
          e.*,

          t.id AS trip_id,
          t.hospital_name,
          t.hospital_address,
          t.hospital_latitude,
          t.hospital_longitude,
          t.hospital_rating,
          t.status AS trip_status,
          t.emergency_date,
          t.emergency_start_time,
          t.ambulance_start_time,
          t.patient_reached_time,
          t.hospital_reached_time,
          t.emergency_end_time

       FROM emergency_requests e

       LEFT JOIN emergency_trips t
         ON e.id =
            t.emergency_request_id

       ORDER BY e.created_at DESC`
    );

    return rows.map(
      (row) =>
        new EmergencyRequest(row)
    );
  },

  async updateEmergencyStatus(
    id,
    status
  ) {
    const db = getDatabase();

    const [result] = await db.query(
      `UPDATE emergency_requests
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.getEmergencyById(id);
  },

  async cancelEmergency(id) {
    return this.updateEmergencyStatus(
      id,
      "CANCELLED"
    );
  }
};

export default emergencyService;