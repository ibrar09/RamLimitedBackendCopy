/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Manage user wishlist items
 */

/**
 * @swagger
 * /wishlists:
 *   post:
 *     summary: Add an item to wishlist
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - product_id
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 10
 *               variant_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Item added to wishlist
 */

/**
 * @swagger
 * /wishlists/user/{user_id}:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of wishlist items
 *
 *   delete:
 *     summary: Clear all wishlist items for a user
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wishlist cleared
 */

/**
 * @swagger
 * /wishlists/{id}:
 *   delete:
 *     summary: Remove an item from wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Wishlist item deleted
 */

import express from "express";
import {
  createWishlistItem,
  getWishlistByUser,
  deleteWishlistItem,
  clearUserWishlist
} from "../controllers/wishlistController.js";

const router = express.Router();

// Routes
router.post("/", createWishlistItem);
router.get("/user/:user_id", getWishlistByUser);
router.delete("/:id", deleteWishlistItem);
router.delete("/user/:user_id", clearUserWishlist);

export default router;
