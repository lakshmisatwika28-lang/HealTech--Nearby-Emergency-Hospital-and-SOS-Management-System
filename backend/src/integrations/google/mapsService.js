const mapsService = {
  generateMapUrl(latitude, longitude) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  },

  generateDirectionsUrl(
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude
  ) {
    return (
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${originLatitude},${originLongitude}` +
      `&destination=${destinationLatitude},${destinationLongitude}`
    );
  }
};

export default mapsService;