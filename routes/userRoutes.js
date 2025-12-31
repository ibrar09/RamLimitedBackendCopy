import express from "express";
import { registerUser, loginUser, getAllUsers ,updateUser ,deleteUser ,getUserById, getProfile, updateProfile, getMe } from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized (no token)
 *       403:
 *         description: Forbidden (not admin)
 */
router.get("/", protect, adminOnly, getAllUsers);
router.get("/me", protect, getProfile);

// PUT update logged-in user's profile
router.put("/me", protect, updateProfile);

router.put("/:id", protect, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/:id", getUserById);

router.get("/:id", protect, getUserById);
router.get("/me", protect, getMe);


export default router;
