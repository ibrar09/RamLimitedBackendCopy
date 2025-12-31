import express from "express";
import multer from "multer";
import path from "path"; // ✅ Add this
import {
  requestInvoice,
  sendInvoicePDF,
  getInvoiceRequests,
  downloadInvoicePDF,
  getInvoiceRequestByOrder,
} from "../controllers/invoiceRequestController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/invoices/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = "invoice-" + Date.now() + ext;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

// Routes
router.post("/request", protect, requestInvoice);
router.post("/send/:id", protect, adminOnly, upload.single("pdf"), sendInvoicePDF);
router.get("/", protect, adminOnly, getInvoiceRequests);
router.get("/download/:id", protect, downloadInvoicePDF);
router.get("/order/:orderId", protect, getInvoiceRequestByOrder);

export default router;
