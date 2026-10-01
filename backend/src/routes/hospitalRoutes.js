import express from "express";
import hospitalController from "../controllers/hospitalController.js";

const router = express.Router();

router.get("/search", hospitalController.search);
router.get("/nearby", hospitalController.nearby);
router.get("/directions", hospitalController.directions);
router.get("/:placeId", hospitalController.details);

export default router;
