import express from "express";
import { exportOrdersPdf } from "../controllers/orderPdfController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/export-pdf", protect, exportOrdersPdf);

export default router;
