import axios from "axios";

const API_BASE_URL =
  "http://localhost:5000/api";

const ambulanceService = {

  async createBooking(
    bookingData
  ) {
    const response =
      await axios.post(
        `${API_BASE_URL}/ambulance`,
        bookingData
      );

    return response.data;
  },

  async getAllBookings() {
    const response =
      await axios.get(
        `${API_BASE_URL}/ambulance`
      );

    return response.data;
  },

  async getBookingById(id) {
    const response =
      await axios.get(
        `${API_BASE_URL}/ambulance/${id}`
      );

    return response.data;
  },

  async updateBookingStatus(
    id,
    status
  ) {
    const response =
      await axios.patch(
        `${API_BASE_URL}/ambulance/${id}/status`,
        { status }
      );

    return response.data;
  },

  async cancelBooking(id) {
    const response =
      await axios.patch(
        `${API_BASE_URL}/ambulance/${id}/cancel`
      );

    return response.data;
  }

};

export default ambulanceService;