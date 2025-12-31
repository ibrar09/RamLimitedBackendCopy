import express from "express";
import {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  getAllAddresses,
} from "../controllers/userAddressController.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UserAddresses
 *   description: Manage logged-in user's addresses
 */

/**
 * @swagger
 * /api/v1/user-addresses:
 *   post:
 *     summary: Create a new address for the logged-in user
 *     tags: [UserAddresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - phone
 *               - address_line1
 *               - city
 *               - country
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address_line1:
 *                 type: string
 *               address_line2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               country:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post("/create", protect,  createAddress);
router.get("/", protect, adminOnly, getAllAddresses);




/**
 * @swagger
 * /api/v1/user-addresses/me:
 *   get:
 *     summary: Get all addresses of the logged-in user
 *     tags: [UserAddresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/me", protect, getUserAddresses);

/**
 * @swagger
 * /api/v1/user-addresses/{id}:
 *   put:
 *     summary: Update an address by ID (only logged-in user's addresses)
 *     tags: [UserAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address_line1:
 *                 type: string
 *               address_line2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               country:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protect, updateAddress);

/**
 * @swagger
 * /api/v1/user-addresses/{id}:
 *   delete:
 *     summary: Delete an address by ID (only logged-in user's addresses)
 *     tags: [UserAddresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", protect, deleteAddress);

export default router;
