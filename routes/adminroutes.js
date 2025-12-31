import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { getAdminDashboard, getAllUsers, updateUserRole, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management routes
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard data
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Not authorized, token missing
 *       403:
 *         description: Access denied, admin only
 */
router.get("/dashboard", protect, adminOnly, getAdminDashboard);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied, admin only
 */
router.get("/users", protect, adminOnly, getAllUsers);

/**
 * @swagger
 * /api/v1/admin/users/{id}/role:
 *   put:
 *     summary: Update user role (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied, admin only
 */
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Access denied, admin only
 */
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
