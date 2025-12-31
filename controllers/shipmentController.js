import * as shipmentService from "../services/shipmentService.js";
import { Shipment, Order } from "../models/index.js";

// -------------------------
// Create Shipment (Admin)
// -------------------------
// controllers/shipmentController.js
export const createShipment = async (req, res) => {
  try {
    const { order_number, status, courier_name, tracking_number } = req.body;

    if (!order_number) {
      return res.status(400).json({ message: "Order number is required" });
    }

    // Find the order by order_number
    const order = await Order.findOne({ where: { order_number } });
    if (!order) return res.status(400).json({ message: "Invalid order_number" });

    const shipmentData = {
      order_id: order.id,
      user_id: order.user_id,
      status,
      courier_name,
      tracking_number: tracking_number || null,
    };

    const shipment = await shipmentService.createShipment(shipmentData);
    res.json({ success: true, message: "Shipment created", shipment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// -------------------------
// Get All Shipments (Admin)
// -------------------------
export const getAllShipments = async (req, res) => {
  try {
    const shipments = await shipmentService.getAllShipments();

    const formatted = shipments.map((s) => ({
      id: s.id,
      order_number: s.order?.order_number || "-",
      status: s.status,
      shipped_date: s.shipped_date,
      delivery_date: s.delivery_date,
      tracking_number: s.tracking_number || null,
      courier_name: s.courier_name || null,
      tracking_url: shipmentService.getTrackingUrl(s),
      admin_comment: s.admin_comment,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Get Shipment by ID
// -------------------------
export const getShipmentById = async (req, res) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id);
    if (!shipment) return res.status(404).json({ message: "Shipment not found" });

    res.json({
      success: true,
      data: {
        ...shipment.dataValues,
        tracking_url: shipmentService.getTrackingUrl(shipment),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Update Shipment (Admin)
// -------------------------
export const updateShipment = async (req, res) => {
  try {
    const shipment = await shipmentService.updateShipment(req.params.id, req.body);
    res.json({
      success: true,
      message: "Shipment updated",
      shipment: { ...shipment.dataValues, tracking_url: shipmentService.getTrackingUrl(shipment) },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// -------------------------
// Delete Shipment (Admin)
// -------------------------
export const deleteShipment = async (req, res) => {
  try {
    await shipmentService.deleteShipment(req.params.id);
    res.json({ success: true, message: "Shipment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Get Shipments by Order
// -------------------------
export const getShipmentsByOrder = async (req, res) => {
  try {
    const shipments = await shipmentService.getShipmentsByOrder(req.params.order_id);
    res.json({ success: true, data: shipments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Get Shipments for Logged-in User
// -------------------------
export const getMyShipments = async (req, res) => {
  try {
    const shipments = await shipmentService.getShipmentsByUser(req.user.id);

    const formatted = shipments.map((s) => ({
      shipment_id: s.id,
      order_number: s.order?.order_number || "-",
      tracking_number: s.tracking_number,
      courier_name: s.courier_name,
      status: s.status,
      shipped_date: s.shipped_date,
      delivery_date: s.delivery_date,
      tracking_url: shipmentService.getTrackingUrl(s),
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------
// Track Shipment
// -------------------------
export const trackShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ where: { tracking_number: req.params.trackingNumber } });

    if (!shipment) return res.status(404).json({ success: false, message: "Tracking number not found" });

    res.json({
      success: true,
      data: {
        courier: shipment.courier_name,
        tracking_number: shipment.tracking_number,
        tracking_url: shipmentService.getTrackingUrl(shipment),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
