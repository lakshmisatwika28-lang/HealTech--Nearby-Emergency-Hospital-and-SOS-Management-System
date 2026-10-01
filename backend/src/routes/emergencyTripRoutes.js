import express from "express";

import emergencyTripController
  from "../controllers/emergencyTripController.js";

const router =
  express.Router();

router.post(
  "/",
  emergencyTripController.createTrip
);

router.get(
  "/",
  emergencyTripController.getAllTrips
);

router.get(
  "/:id",
  emergencyTripController.getTripById
);

router.patch(
  "/:id",
  emergencyTripController.updateTrip
);

export default router;