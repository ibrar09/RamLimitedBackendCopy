import express from "express";
import {
  createPayment,
  getPaymentById, // Changed from getPayment
  getPaymentsByOrder,
  getAllPayments,
  updatePayment,
  deletePayment,
  getPaymentsByUser,

  confirmPayment,
  
} from "../controllers/paymentController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API endpoints for managing order payments
 */

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     summary: Create a new payment (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - payment_method
 *               - amount
 *             properties:
 *               order_id:
 *                 type: integer
 *               payment_reference:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *               gateway_response:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 */
router.post("/", protect, adminOnly, createPayment);

/**
 * @swagger
 * /api/v1/payments:
 *   get:
 *     summary: Get all payments (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 */
router.get("/", protect, adminOnly, getAllPayments);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   get:
 *     summary: Get payment by ID (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 */
router.get("/:id", protect, adminOnly, getPaymentById); // Changed to getPaymentById

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   put:
 *     summary: Update a payment (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_reference:
 *                 type: string
 *               payment_method:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *               gateway_response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment updated successfully
 */
router.put("/:id", protect, adminOnly, updatePayment);

/**
 * @swagger
 * /api/v1/payments/{id}:
 *   delete:
 *     summary: Delete a payment (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted
 */
router.delete("/:id", protect, adminOnly, deletePayment);

/**
 * @swagger
 * /api/v1/payments/user/me:
 *   get:
 *     summary: Get payments for the logged-in user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments for the logged-in user
 *       401:
 *         description: Unauthorized
 */
router.get("/user/me", protect, getPaymentsByUser);

/**
 * @swagger
 * /api/v1/payments/order/{order_id}:
 *   get:
 *     summary: Get all payments for a specific order (User sees only their orders, Admin sees all)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: List of payments for the order
 *       403:
 *         description: Access denied
 */
router.get("/order/:order_id", protect, getPaymentsByOrder);
router.get("/confirm/:tapChargeId", confirmPayment);



export default router;