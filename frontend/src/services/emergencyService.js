import api from "./api";

const emergencyService = {

  async createEmergency(
    latitude,
    longitude,
    emergencyType = "General Emergency"
  ) {
    const response =
      await api.post(
        "/emergency",
        {
          latitude,
          longitude,
          emergencyType
        }
      );

    return response.data;
  },

  async getEmergencyById(id) {
    const response =
      await api.get(
        `/emergency/${id}`
      );

    return response.data;
  },

  async getAllEmergencies() {
    const response =
      await api.get(
        "/emergency"
      );

    return response.data;
  },

  async updateEmergencyStatus(
    id,
    status
  ) {
    const response =
      await api.patch(
        `/emergency/${id}/status`,
        { status }
      );

    return response.data;
  },

  async cancelEmergency(id) {
    const response =
      await api.patch(
        `/emergency/${id}/cancel`
      );

    return response.data;
  },

  async findNearbyHospitals(
    latitude,
    longitude
  ) {
    const response =
      await api.get(
        "/emergency/nearby-hospitals",
        {
          params: {
            latitude,
            longitude
          }
        }
      );

    return response.data;
  }

};

export default emergencyService;