// services/orderItemService.js
import { OrderItem } from "../models/index.js";

/**
 * Create a new order item
 * @param {Object} data - Order item data
 * @returns {Promise<OrderItem>}
 */
export const createOrderItem = async (data) => {
  const item = await OrderItem.create(data);
  return item;
};

/**
 * Get all order items
 * @returns {Promise<OrderItem[]>}
 */
export const getAllOrderItems = async () => {
  return await OrderItem.findAll();
};

/**
 * Get order items by a specific order ID
 * @param {number} order_id
 * @returns {Promise<OrderItem[]>}
 */
export const getOrderItemsByOrderId = async (order_id) => {
  return await OrderItem.findAll({ where: { order_id } });
};

/**
 * Update an order item by ID
 * @param {number} id
 * @param {Object} data - Fields to update
 * @returns {Promise<OrderItem>}
 */
export const updateOrderItem = async (id, data) => {
  await OrderItem.update(data, { where: { id } });
  return await OrderItem.findByPk(id);
};

/**
 * Delete an order item by ID
 * @param {number} id
 * @returns {Promise<number>} - Number of deleted rows
 */
export const deleteOrderItem = async (id) => {
  return await OrderItem.destroy({ where: { id } });
};
