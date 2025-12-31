import express from "express";
import {
  createOrderItem,
  getAllOrderItems,
  getOrderItemsByOrderId,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/orderItemController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Order Items
 *   description: API endpoints for managing order items
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         order_id:
 *           type: integer
 *           example: 10
 *         product_id:
 *           type: integer
 *           example: 5
 *         variant_id:
 *           type: integer
 *           example: 2
 *         quantity:
 *           type: integer
 *           example: 3
 *         price:
 *           type: number
 *           example: 49.99
 *         total:
 *           type: number
 *           example: 149.97
 *     CreateOrderItem:
 *       type: object
 *       required:
 *         - order_id
 *         - product_id
 *         - quantity
 *         - price
 *         - total
 *       properties:
 *         order_id:
 *           type: integer
 *           example: 10
 *         product_id:
 *           type: integer
 *           example: 5
 *         variant_id:
 *           type: integer
 *           example: 2
 *         quantity:
 *           type: integer
 *           example: 3
 *         price:
 *           type: number
 *           example: 49.99
 *         total:
 *           type: number
 *           example: 149.97
 *     UpdateOrderItem:
 *       type: object
 *       properties:
 *         quantity:
 *           type: integer
 *           example: 5
 *         price:
 *           type: number
 *           example: 49.99
 *         total:
 *           type: number
 *           example: 249.95
 */

/**
 * @swagger
 * /api/v1/order-items:
 *   get:
 *     summary: Get all order items
 *     tags: [Order Items]
 *     responses:
 *       200:
 *         description: Successfully retrieved all order items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderItem'
 */
router.get("/", getAllOrderItems);

/**
 * @swagger
 * /api/v1/order-items:
 *   post:
 *     summary: Create a new order item
 *     tags: [Order Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderItem'
 *     responses:
 *       201:
 *         description: Order item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OrderItem'
 */
router.post("/", createOrderItem);

/**
 * @swagger
 * /api/v1/order-items/order/{order_id}:
 *   get:
 *     summary: Get all order items for a specific order
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: Successfully retrieved order items for the given order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderItem'
 */
router.get("/order/:order_id", getOrderItemsByOrderId);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   put:
 *     summary: Update an order item
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderItem'
 *     responses:
 *       200:
 *         description: Order item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OrderItem'
 */
router.put("/:id", updateOrderItem);

/**
 * @swagger
 * /api/v1/order-items/{id}:
 *   delete:
 *     summary: Delete an order item
 *     tags: [Order Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.delete("/:id", deleteOrderItem);

export default router;
