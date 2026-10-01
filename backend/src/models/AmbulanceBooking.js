class AmbulanceBooking {
  constructor(data) {
    this.id = data.id;

    this.patientName =
      data.patient_name;

    this.phone =
      data.phone;

    this.bookingDate =
      data.booking_date;

    this.bookingTime =
      data.booking_time;

    this.pickupLatitude =
      data.pickup_latitude;

    this.pickupLongitude =
      data.pickup_longitude;

    this.destination =
      data.destination;

    this.ambulanceType =
      data.ambulance_type;

    this.status =
      data.status;

    this.createdAt =
      data.created_at;

    this.updatedAt =
      data.updated_at;
  }
}

export default AmbulanceBooking;