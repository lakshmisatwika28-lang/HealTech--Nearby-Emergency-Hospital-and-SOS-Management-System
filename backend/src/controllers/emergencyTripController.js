import emergencyTripService
  from "../services/emergencyTripService.js";

const emergencyTripController = {
  async createTrip(req, res) {
    try {
      const trip =
        await emergencyTripService.createTrip(
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          "Emergency trip created successfully",
        data: trip
      });
    } catch (error) {
      console.error(
        "Create emergency trip error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create emergency trip"
      });
    }
  },

  async getTripById(req, res) {
    try {
      const trip =
        await emergencyTripService.getTripById(
          req.params.id
        );

      if (!trip) {
        return res.status(404).json({
          success: false,
          message:
            "Emergency trip not found"
        });
      }

      res.status(200).json({
        success: true,
        data: trip
      });
    } catch (error) {
      console.error(
        "Get emergency trip error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch emergency trip"
      });
    }
  },

  async updateTrip(req, res) {
    try {
      const trip =
        await emergencyTripService.updateTrip(
          req.params.id,
          req.body
        );

      if (!trip) {
        return res.status(404).json({
          success: false,
          message:
            "Emergency trip not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Emergency trip updated successfully",
        data: trip
      });
    } catch (error) {
      console.error(
        "Update emergency trip error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update emergency trip"
      });
    }
  },

  async getAllTrips(req, res) {
    try {
      const trips =
        await emergencyTripService.getAllTrips();

      res.status(200).json({
        success: true,
        count: trips.length,
        data: trips
      });
    } catch (error) {
      console.error(
        "Get emergency trips error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch emergency trips"
      });
    }
  }
};

export default emergencyTripController;