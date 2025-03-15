import express from "express";
import { guestAccess } from "../controllers/Guest.controllers.js";

const router = express.Router();

// Guest Access Route
router.post("/guest", guestAccess);

export default router;
