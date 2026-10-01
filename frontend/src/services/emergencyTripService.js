const API_BASE_URL =
  "http://localhost:5000/api";

const emergencyTripService = {
  async createTrip(tripData) {
    const response =
      await fetch(
        `${API_BASE_URL}/emergency-trips`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(tripData)
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
        "Failed to create emergency trip"
      );
    }

    return data;
  },

  async getTripById(id) {
    const response =
      await fetch(
        `${API_BASE_URL}/emergency-trips/${id}`
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
        "Failed to fetch emergency trip"
      );
    }

    return data;
  },

  async updateTrip(id, updates) {
    const response =
      await fetch(
        `${API_BASE_URL}/emergency-trips/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(updates)
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
        "Failed to update emergency trip"
      );
    }

    return data;
  }
};

export default emergencyTripService;