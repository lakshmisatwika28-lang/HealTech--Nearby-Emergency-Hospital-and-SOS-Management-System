class EmergencyRequest {
  constructor(data) {
    this.id = data.id;

    this.latitude = data.latitude;

    this.longitude = data.longitude;

    this.status = data.status;

    this.emergencyType =
      data.emergency_type;

    this.createdAt =
      data.created_at;

    this.updatedAt =
      data.updated_at;

    this.tripId =
      data.trip_id || null;

    this.hospitalName =
      data.hospital_name || null;

    this.hospitalAddress =
      data.hospital_address || null;

    this.hospitalLatitude =
      data.hospital_latitude || null;

    this.hospitalLongitude =
      data.hospital_longitude || null;

    this.hospitalRating =
      data.hospital_rating || null;

    this.tripStatus =
      data.trip_status || null;

    this.emergencyDate =
      data.emergency_date || null;

    this.emergencyStartTime =
      data.emergency_start_time || null;

    this.ambulanceStartTime =
      data.ambulance_start_time || null;

    this.patientReachedTime =
      data.patient_reached_time || null;

    this.hospitalReachedTime =
      data.hospital_reached_time || null;

    this.emergencyEndTime =
      data.emergency_end_time || null;
  }
}

export default EmergencyRequest;