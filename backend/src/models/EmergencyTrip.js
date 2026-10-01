class EmergencyTrip {
  constructor(data) {
    this.id = data.id;

    this.emergencyRequestId =
      data.emergency_request_id;

    this.emergencyDate =
      data.emergency_date;

    this.emergencyStartTime =
      data.emergency_start_time;

    this.emergencyEndTime =
      data.emergency_end_time;

    this.patientLatitude =
      data.patient_latitude;

    this.patientLongitude =
      data.patient_longitude;

    this.hospitalName =
      data.hospital_name;

    this.hospitalAddress =
      data.hospital_address;

    this.hospitalLatitude =
      data.hospital_latitude;

    this.hospitalLongitude =
      data.hospital_longitude;

    this.hospitalRating =
      data.hospital_rating;

    this.ambulanceStartTime =
      data.ambulance_start_time;

    this.patientReachedTime =
      data.patient_reached_time;

    this.hospitalReachedTime =
      data.hospital_reached_time;

    this.ambulanceToPatientDistance =
      data.ambulance_to_patient_distance;

    this.ambulanceToPatientEta =
      data.ambulance_to_patient_eta;

    this.patientToHospitalDistance =
      data.patient_to_hospital_distance;

    this.patientToHospitalEta =
      data.patient_to_hospital_eta;

    this.status =
      data.status;

    this.createdAt =
      data.created_at;

    this.updatedAt =
      data.updated_at;
  }
}

export default EmergencyTrip;