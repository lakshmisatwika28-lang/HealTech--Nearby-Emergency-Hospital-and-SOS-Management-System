export const validateEmergency = (req, res, next) => {
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required"
    });
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    Number.isNaN(lat) ||
    Number.isNaN(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid latitude or longitude"
    });
  }

  next();
};

export const validateContact = (req, res, next) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name and phone are required"
    });
  }

  next();
};

export const validateAmbulanceBooking = (req, res, next) => {
  const { patientName, phone } = req.body;

  if (!patientName || !phone) {
    return res.status(400).json({
      success: false,
      message: "Patient name and phone are required"
    });
  }

  next();
};