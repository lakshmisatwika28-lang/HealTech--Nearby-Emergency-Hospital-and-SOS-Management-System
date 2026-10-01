import express from "express";
import ambulanceController from "../controllers/ambulanceController.js";

const router = express.Router();

router.post("/", ambulanceController.createBooking);

router.get("/", ambulanceController.getAllBookings);

router.get("/:id", ambulanceController.getBookingById);

router.patch("/:id/status", ambulanceController.updateBookingStatus);

router.patch("/:id/cancel", ambulanceController.cancelBooking);

export default router;