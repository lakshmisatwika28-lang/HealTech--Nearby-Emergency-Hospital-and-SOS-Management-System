const locationService = {
  validateCoordinates(latitude, longitude) {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return false;
    }

    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },

  getLocationFromRequest(req) {
    const { latitude, longitude } = req.body;

    return {
      latitude: latitude !== undefined ? Number(latitude) : null,
      longitude: longitude !== undefined ? Number(longitude) : null
    };
  }
};

export default locationService;