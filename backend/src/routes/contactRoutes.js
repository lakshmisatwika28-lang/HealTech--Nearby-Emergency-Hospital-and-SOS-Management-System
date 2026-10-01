import express from "express";
import contactController from "../controllers/contactController.js";

const router = express.Router();

router.get("/", contactController.getAllContacts);

router.get("/:id", contactController.getContactById);

router.post("/", contactController.createContact);

router.put("/:id", contactController.updateContact);

router.delete("/:id", contactController.deleteContact);

export default router;