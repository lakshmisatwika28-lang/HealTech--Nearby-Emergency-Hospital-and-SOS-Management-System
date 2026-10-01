import axios from "axios";

const API_BASE_URL =
  "http://localhost:5000/api";

const emergencyService = {

  async createEmergency(
    latitude,
    longitude,
    emergencyType = "General Emergency"
  ) {
    const response =
      await axios.post(
        `${API_BASE_URL}/emergency`,
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
      await axios.get(
        `${API_BASE_URL}/emergency/${id}`
      );

    return response.data;
  },


  async getAllEmergencies() {
    const response =
      await axios.get(
        `${API_BASE_URL}/emergency`
      );

    return response.data;
  },


  async updateEmergencyStatus(
    id,
    status
  ) {
    const response =
      await axios.patch(
        `${API_BASE_URL}/emergency/${id}/status`,
        { status }
      );

    return response.data;
  },


  async cancelEmergency(id) {
    const response =
      await axios.patch(
        `${API_BASE_URL}/emergency/${id}/cancel`
      );

    return response.data;
  },


  async findNearbyHospitals(
    latitude,
    longitude
  ) {
    const response =
      await axios.get(
        `${API_BASE_URL}/emergency/nearby-hospitals`,
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