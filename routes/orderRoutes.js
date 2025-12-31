import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getMyOrders,
  createTapPayment,
  captureTapPayment,
  cancelOrder,
  getTapPaymentStatus,
  hasPurchasedProduct
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { exportOrdersPdf } from "../controllers/orderPdfController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Manage orders & Tap payments
 *
 * components:
 *   schemas:
 *     OrderItemInput:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *       properties:
 *         product_id:
 *           type: integer
 *         variant_id:
 *           type: integer
 *           nullable: true
 *         quantity:
 *           type: integer
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - address_id
 *         - payment_method
 *         - products
 *       properties:
 *         user_id:
 *           type: integer
 *         address_id:
 *           type: integer
 *         payment_method:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/OrderItemInput"
 *     PaymentInitRequest:
 *       type: object
 *       required:
 *         - orderId
 *         - amount
 *         - source_id
 *       properties:
 *         orderId:
 *           type: integer
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *           example: SAR
 *         description:
 *           type: string
 *         source_id:
 *           type: string
 *           description: Tap card/source id
 *     PaymentCaptureRequest:
 *       type: object
 *       required:
 *         - orderId
 *         - tapPaymentId
 *       properties:
 *         orderId:
 *           type: integer
 *         tapPaymentId:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateOrderRequest"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createOrder);

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders (admin) or user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllOrders);

/**
 * @swagger
 * /api/v1/orders/my/orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 */
router.get("/my/orders", protect, getMyOrders);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getOrderById);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Update an order (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update (status, payment_status, etc.)
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, adminOnly, updateOrder);

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Delete an order (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       403:
 *         description: Forbidden
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, adminOnly, deleteOrder);

/**
 * @swagger
 * /api/v1/orders/payment/init:
 *   post:
 *     summary: Initialize Tap payment for an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PaymentInitRequest"
 *     responses:
 *       200:
 *         description: Tap payment initialized
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/payment/init", protect, createTapPayment);

/**
 * @swagger
 * /api/v1/orders/payment/capture:
 *   post:
 *     summary: Capture or confirm Tap payment
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PaymentCaptureRequest"
 *     responses:
 *       200:
 *         description: Payment captured or status returned
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/payment/capture", protect, captureTapPayment);

router.post("/:order_number/cancel", protect, cancelOrder);
router.get("/payment/status/:tapId", protect, getTapPaymentStatus);
router.post("/export-pdf", protect,adminOnly, exportOrdersPdf);
router.get(
  "/has-purchased/:productId",
  protect,
  hasPurchasedProduct
);


export default router;
