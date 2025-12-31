import express from "express";
import { requestInvoice, userListRequests } from "../controllers/invoiceRequestController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// User requests an invoice
router.post("/request", authMiddleware, requestInvoice);

// List user's invoice requests
router.get("/my-requests", authMiddleware, userListRequests);

export default router;
