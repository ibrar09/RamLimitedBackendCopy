import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getDashboardOrders, getOrderById } from "../controllers/orderController.js";
import { getDashboardPayments, getPaymentsByOrderNumber, getPaymentsByUserController } from "../controllers/paymentController.js";
import { getMyShipments } from "../controllers/shipmentController.js";
import { getDashboardProfile } from "../controllers/userController.js";
import { getStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.use(protect); // All routes require logged-in user

// Orders
router.get("/orders", getDashboardOrders);
router.get("/orders/:id", getOrderById);

// Payments
router.get("/dashboard/payments", getDashboardPayments);
router.get("/payments", getPaymentsByUserController);
router.get("/payments/order/:order_number", getPaymentsByOrderNumber);

// Shipments
router.get("/shipments/my", getMyShipments);

// Profile
router.get("/profile", getDashboardProfile);

// Statistics
router.get("/stats", getStats);

export default router;
