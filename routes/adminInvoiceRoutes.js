import express from "express";
import multer from "multer";
import { adminSendInvoice, adminListRequests } from "../controllers/invoiceRequestController.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = express.Router();
const upload = multer(); // multer memory storage

// Admin list all invoice requests
router.get("/requests", authMiddleware, adminMiddleware, adminListRequests);

// Admin upload PDF & send
router.post("/send", authMiddleware, adminMiddleware, upload.single("pdfFile"), adminSendInvoice);

export default router;
