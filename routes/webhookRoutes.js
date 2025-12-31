// backend/routes/webhookRoutes.js
import express from "express";
import { tapWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Only apply express.raw here
router.post("/tap", tapWebhook);

export default router;
