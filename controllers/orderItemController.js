// controllers/orderItemController.js
import * as orderItemService from "../services/orderItemService.js";

/**
 * Create a new order item
 */
export const createOrderItem = async (req, res) => {
  try {
    const item = await orderItemService.createOrderItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all order items
 */
export const getAllOrderItems = async (req, res) => {
  try {
    const items = await orderItemService.getAllOrderItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get order items by a specific order ID
 */
export const getOrderItemsByOrderId = async (req, res) => {
  try {
    const items = await orderItemService.getOrderItemsByOrderId(req.params.order_id);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update an order item by ID
 */
export const updateOrderItem = async (req, res) => {
  try {
    const item = await orderItemService.updateOrderItem(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete an order item by ID
 */
export const deleteOrderItem = async (req, res) => {
  try {
    await orderItemService.deleteOrderItem(req.params.id);
    res.json({ message: "Order item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
