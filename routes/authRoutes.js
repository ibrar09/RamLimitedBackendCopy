// backend/routes/authRoutes.js
import express from "express";
import {
  googleLogin,
  googleCallback,
  registerUser,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
  resendOtp,
  refreshAccessToken
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication Routes
 */

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Redirect to Google Login Page
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth page
 */
router.get("/google", googleLogin);

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback URL
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Google OAuth authorization code
 *     responses:
 *       200:
 *         description: Google login success
 */
router.get("/google/callback", googleCallback);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user and send OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent for verification
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/verify-otp", verifyOtp);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with email & password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current authenticated user
 */
router.get("/me", protect, getMe);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout the user (clear cookies)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.get("/logout", logout);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Resend OTP to user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Email not provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to resend OTP
 */
router.post("/resend-otp", resendOtp);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token issued at login
 *     responses:
 *       200:
 *         description: New access token issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token
 *       400:
 *         description: Refresh token not provided
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh-token", refreshAccessToken);

export default router;
