import api from "./api";

const emergencyTripService = {
  async createTrip(tripData) {
    const response =
      await api.post(
        "/emergency-trips",
        tripData
      );

    return response.data;
  },

  async getTripById(id) {
    const response =
      await api.get(
        `/emergency-trips/${id}`
      );

    return response.data;
  },

  async updateTrip(id, updates) {
    const response =
      await api.patch(
        `/emergency-trips/${id}`,
        updates
      );

    return response.data;
  }
};

export default emergencyTripService;
