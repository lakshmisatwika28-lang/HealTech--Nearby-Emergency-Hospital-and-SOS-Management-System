import hospitalService from "../services/hospitalService.js";

const hospitalController = {
  async search(req, res) {
    try {
      const { q, latitude, longitude } = req.query;
      if (!q?.trim()) return res.status(400).json({ success:false, message:"Search query is required." });
      const hospitals = await hospitalService.searchHospitals(q, latitude, longitude);
      res.json({ success:true, data:hospitals });
    } catch (error) {
      res.status(500).json({ success:false, message:error.message });
    }
  },

  async nearby(req, res) {
    try {
      const { latitude, longitude, radius } = req.query;
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ success:false, message:"Latitude and longitude are required." });
      }
      const hospitals = await hospitalService.nearbyHospitals(latitude, longitude, radius);
      res.json({ success:true, data:hospitals });
    } catch (error) {
      res.status(500).json({ success:false, message:error.message });
    }
  },

  async details(req, res) {
    try {
      const hospital = await hospitalService.getHospitalDetails(req.params.placeId);
      res.json({ success:true, data:hospital });
    } catch (error) {
      res.status(500).json({ success:false, message:error.message });
    }
  },

  async directions(req, res) {
    try {
      const { originLatitude, originLongitude, destinationLatitude, destinationLongitude } = req.query;
      const data = await hospitalService.getDirections(
        originLatitude, originLongitude, destinationLatitude, destinationLongitude
      );
      res.json({ success:true, data });
    } catch (error) {
      res.status(500).json({ success:false, message:error.message });
    }
  }
};

export default hospitalController;
