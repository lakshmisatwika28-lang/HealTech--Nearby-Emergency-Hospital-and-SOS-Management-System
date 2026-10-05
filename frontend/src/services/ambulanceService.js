import api from "./api";

const ambulanceService = {

  async createBooking(
    bookingData
  ) {
    const response =
      await api.post(
        "/ambulance",
        bookingData
      );

    return response.data;
  },

  async getAllBookings() {
    const response =
      await api.get(
        "/ambulance"
      );

    return response.data;
  },

  async getBookingById(id) {
    const response =
      await api.get(
        `/ambulance/${id}`
      );

    return response.data;
  },

  async updateBookingStatus(
    id,
    status
  ) {
    const response =
      await api.patch(
        `/ambulance/${id}/status`,
        { status }
      );

    return response.data;
  },

  async cancelBooking(id) {
    const response =
      await api.patch(
        `/ambulance/${id}/cancel`
      );

    return response.data;
  }

};

export default ambulanceService;