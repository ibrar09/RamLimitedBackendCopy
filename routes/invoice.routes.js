import express from "express";
import {  createInvoiceAfterPayment, downloadInvoicePDF } from "../controllers/invoice.controller.js"; 
import { v4 as uuidv4 } from "uuid"; // ✅ import uuid
import { getOrderById } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Test route to create invoice
// router.post("/create", async (req, res) => {
//   try {
//     const order = req.body;
//     order.id = order.id || uuidv4();
//     order.userId = order.userId || uuidv4();

//     const invoice = await createInvoiceAfterPayment(order);
//     res.json(invoice);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Download route
// router.get("/:invoiceId/download", downloadInvoicePDF);
router.get("/:orderId/download", downloadInvoicePDF);


router.post("/create", createInvoiceAfterPayment);



export default router;
