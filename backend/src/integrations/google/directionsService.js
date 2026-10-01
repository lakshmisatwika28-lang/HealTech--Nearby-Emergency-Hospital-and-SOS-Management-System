import axios from "axios";

const directionsService = {
  async getDirections(
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude
  ) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ GOOGLE_MAPS_API_KEY is not configured");

      return null;
    }

    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/directions/json",
        {
          params: {
            origin: `${originLatitude},${originLongitude}`,
            destination: `${destinationLatitude},${destinationLongitude}`,
            key: apiKey
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Directions request failed:",
        error.message
      );

      throw error;
    }
  }
};

export default directionsService;