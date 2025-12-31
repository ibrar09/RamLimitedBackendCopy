import express from "express";
import {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  getShipmentsByOrder,
  getMyShipments,
  trackShipment,
} from "../controllers/shipmentController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ------------------------------
// Create Shipment (Admin)
// ------------------------------
router.post("/", protect, adminOnly, createShipment);

// ------------------------------
// Get all shipments (Admin)
// ------------------------------
router.get("/", protect, adminOnly, getAllShipments);

// ------------------------------
// Get logged-in user's shipments
// ------------------------------
router.get("/my", protect, getMyShipments);

// ------------------------------
// Track Shipment by tracking number
// Returns courier info + direct tracking URL
// ------------------------------
router.get("/track/:trackingNumber", protect, trackShipment);

// ------------------------------
// Get shipments by order id
// ------------------------------
router.get("/order/:order_id", protect, getShipmentsByOrder);

// ------------------------------
// Dynamic route for shipment by ID
// Must be at bottom to avoid conflicts
// ------------------------------
router.get("/:id", protect, getShipmentById);

// ------------------------------
// Update Shipment (Admin)
// ------------------------------
router.put("/:id", protect, adminOnly, updateShipment);

// ------------------------------
// Delete Shipment (Admin)
// ------------------------------
router.delete("/:id", protect, adminOnly, deleteShipment);

export default router;
