import express from "express";

import emergencyController, {
  getNearbyHospitals
} from "../controllers/emergencyController.js";

const router = express.Router();

// ===============================
// NEARBY HOSPITALS
// IMPORTANT: BEFORE /:id
// ===============================

router.get(
  "/nearby-hospitals",
  getNearbyHospitals
);

// ===============================
// EMERGENCY ROUTES
// ===============================

router.post(
  "/",
  emergencyController.createEmergency
);

router.get(
  "/",
  emergencyController.getAllEmergencies
);

router.get(
  "/:id",
  emergencyController.getEmergencyById
);

router.patch(
  "/:id/status",
  emergencyController.updateEmergencyStatus
);

router.patch(
  "/:id/cancel",
  emergencyController.cancelEmergency
);

export default router;