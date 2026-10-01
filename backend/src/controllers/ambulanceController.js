import ambulanceService from "../services/ambulanceService.js";

const ambulanceController = {
  // ===============================
  // CREATE BOOKING
  // ===============================

  async createBooking(req, res) {
    try {
      const {
        patientName,
        phone,
        bookingDate,
        bookingTime,
        pickupLatitude,
        pickupLongitude,
        destination,
        ambulanceType
      } = req.body;

      if (!patientName || !phone) {
        return res.status(400).json({
          success: false,
          message: "Patient name and phone are required"
        });
      }

      if (!bookingDate || !bookingTime) {
        return res.status(400).json({
          success: false,
          message: "Booking date and booking time are required"
        });
      }

      const booking =
        await ambulanceService.createBooking({
          patientName,
          phone,
          bookingDate,
          bookingTime,
          pickupLatitude,
          pickupLongitude,
          destination,
          ambulanceType
        });

      res.status(201).json({
        success: true,
        message: "Ambulance booking created successfully",
        data: booking
      });

    } catch (error) {
      console.error(
        "Create ambulance booking error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Failed to create ambulance booking"
      });
    }
  },

  // ===============================
  // GET ALL BOOKINGS
  // ===============================

  async getAllBookings(req, res) {
    try {
      const bookings =
        await ambulanceService.getAllBookings();

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });

    } catch (error) {
      console.error(
        "Get ambulance bookings error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch ambulance bookings"
      });
    }
  },

  // ===============================
  // GET ONE BOOKING
  // ===============================

  async getBookingById(req, res) {
    try {
      const { id } =
        req.params;

      const booking =
        await ambulanceService.getBookingById(
          id
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Ambulance booking not found"
        });
      }

      res.status(200).json({
        success: true,
        data: booking
      });

    } catch (error) {
      console.error(
        "Get ambulance booking error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch ambulance booking"
      });
    }
  },

  // ===============================
  // UPDATE STATUS
  // ===============================

  async updateBookingStatus(req, res) {
    try {
      const { id } =
        req.params;

      const { status } =
        req.body;

      const allowedStatuses = [
        "REQUESTED",
        "CONFIRMED",
        "ON_THE_WAY",
        "ARRIVED",
        "COMPLETED",
        "CANCELLED"
      ];

      if (
        !status ||
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid ambulance booking status"
        });
      }

      const booking =
        await ambulanceService.updateBookingStatus(
          id,
          status
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Ambulance booking not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Ambulance booking status updated successfully",
        data: booking
      });

    } catch (error) {
      console.error(
        "Update ambulance status error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update ambulance booking status"
      });
    }
  },

  // ===============================
  // CANCEL BOOKING
  // ===============================

  async cancelBooking(req, res) {
    try {
      const { id } =
        req.params;

      const booking =
        await ambulanceService.cancelBooking(
          id
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Ambulance booking not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Ambulance booking cancelled",
        data: booking
      });

    } catch (error) {
      console.error(
        "Cancel ambulance booking error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to cancel ambulance booking"
      });
    }
  }
};

export default ambulanceController;