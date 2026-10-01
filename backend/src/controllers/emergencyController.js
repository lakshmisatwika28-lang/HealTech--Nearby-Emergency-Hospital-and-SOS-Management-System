import placesService from "../integrations/google/placesService.js";
import emergencyService from "../services/emergencyService.js";
import notificationService from "../services/notificationService.js";
import contactService from "../services/contactService.js";

const emergencyController = {
  // ===============================
  // CREATE SOS
  // ===============================

  async createEmergency(req, res) {
    try {
      const {
        latitude,
        longitude,
        emergencyType
      } = req.body;

      if (
        latitude === undefined ||
        longitude === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Latitude and longitude are required"
        });
      }

      const emergency =
        await emergencyService.createEmergency({
          latitude,
          longitude,
          emergencyType
        });

      // ===============================
      // PROCESS EMERGENCY NOTIFICATION
      // ===============================

      await notificationService.sendEmergencyNotification(
        emergency
      );

      // ===============================
      // CALL ALL SAVED EMERGENCY CONTACTS
      // ===============================

      const contacts =
        await contactService.getAllContacts();

      for (const contact of contacts) {
        try {
          await notificationService.sendContactNotification(
            contact,
            emergency
          );

          console.log(
            `📞 Emergency call initiated for ${contact.name}`
          );
        } catch (notificationError) {
          console.error(
            `📞 Emergency call failed for ${contact.name}:`,
            notificationError.message
          );
        }
      }

      res.status(201).json({
        success: true,
        message:
          "Emergency request created successfully",
        data: emergency
      });
    } catch (error) {
      console.error(
        "Create emergency error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create emergency request"
      });
    }
  },

  // ===============================
  // GET ALL EMERGENCIES
  // ===============================

  async getAllEmergencies(req, res) {
    try {
      const emergencies =
        await emergencyService.getAllEmergencies();

      res.status(200).json({
        success: true,
        count: emergencies.length,
        data: emergencies
      });
    } catch (error) {
      console.error(
        "Get emergencies error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch emergency requests"
      });
    }
  },

  // ===============================
  // GET ONE EMERGENCY
  // ===============================

  async getEmergencyById(req, res) {
    try {
      const { id } = req.params;

      const emergency =
        await emergencyService.getEmergencyById(id);

      if (!emergency) {
        return res.status(404).json({
          success: false,
          message:
            "Emergency request not found"
        });
      }

      res.status(200).json({
        success: true,
        data: emergency
      });
    } catch (error) {
      console.error(
        "Get emergency error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch emergency request"
      });
    }
  },

  // ===============================
  // UPDATE STATUS
  // ===============================

  async updateEmergencyStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "ACTIVE",
        "RESPONDED",
        "RESOLVED",
        "CANCELLED"
      ];

      if (
        !status ||
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid emergency status"
        });
      }

      const emergency =
        await emergencyService.updateEmergencyStatus(
          id,
          status
        );

      if (!emergency) {
        return res.status(404).json({
          success: false,
          message:
            "Emergency request not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Emergency status updated successfully",
        data: emergency
      });
    } catch (error) {
      console.error(
        "Update emergency status error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update emergency status"
      });
    }
  },

  // ===============================
  // CANCEL SOS
  // ===============================

  async cancelEmergency(req, res) {
    try {
      const { id } = req.params;

      const emergency =
        await emergencyService.cancelEmergency(id);

      if (!emergency) {
        return res.status(404).json({
          success: false,
          message:
            "Emergency request not found"
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Emergency request cancelled",
        data: emergency
      });
    } catch (error) {
      console.error(
        "Cancel emergency error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to cancel emergency request"
      });
    }
  }
};

// ===============================
// GET NEARBY HOSPITALS
// ===============================

const getNearbyHospitals = async (
  req,
  res,
  next
) => {
  try {
    const latitude =
      Number(req.query.latitude);

    const longitude =
      Number(req.query.longitude);

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid latitude and longitude are required."
      });
    }

    const hospitals =
      await placesService.findNearbyHospitals(
        latitude,
        longitude
      );

    res.status(200).json({
      success: true,
      data: hospitals
    });
  } catch (error) {
    console.error(
      "Get nearby hospitals error:",
      error.message
    );

    next(error);
  }
};

// ===============================
// EXPORTS
// ===============================

export {
  emergencyController,
  getNearbyHospitals
};

export default emergencyController;