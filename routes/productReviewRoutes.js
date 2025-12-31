// routes/productReviewRoutes.js
import express from "express";
import {
  createReview,
  getAllReviews,
  getReviewsByProductId,
  updateReview,
  deleteReview,
} from "../controllers/productReviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product Reviews
 *   description: API endpoints for product reviews
 */

/**
 * @swagger
 * /api/v1/product-reviews:
 *   post:
 *     summary: Create a new review (admin or user)
 *     tags: [Product Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - user_id
 *               - rating
 *               - reviewer_type
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 example: 2
 *               rating:
 *                 type: integer
 *                 example: 5
 *               review_text:
 *                 type: string
 *                 example: "Great product!"
 *               reviewer_type:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: "user"
 *               status:
 *                 type: string
 *                 description: "Optional; will be automatically set based on reviewer_type"
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request (e.g., user hasn’t purchased the product)
 *
 *   get:
 *     summary: Get all reviews (for admin/internal use)
 *     tags: [Product Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 */

/**
 * @swagger
 * /api/v1/product-reviews/product/{product_id}:
 *   get:
 *     summary: Get approved reviews by product ID (for public display)
 *     tags: [Product Reviews]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of approved reviews
 */

/**
 * @swagger
 * /api/v1/product-reviews/{id}:
 *   put:
 *     summary: Update a review by ID (admin)
 *     tags: [Product Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               review_text:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, pending, rejected]
 *     responses:
 *       200:
 *         description: Review updated successfully
 *
 *   delete:
 *     summary: Delete a review by ID (admin)
 *     tags: [Product Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */

router.post("/",protect, createReview);
router.get("/", getAllReviews);
router.get("/product/:product_id", getReviewsByProductId);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
