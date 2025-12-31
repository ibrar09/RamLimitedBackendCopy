/**
 * @swagger
 * tags:
 *   name: Product Features
 *   description: API endpoints for managing product key features
 */

/**
 * @swagger
 * /product-features:
 *   post:
 *     summary: Create a new product feature
 *     tags: [Product Features]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - feature_name
 *               - feature_value
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               feature_name:
 *                 type: string
 *                 example: "Display"
 *               feature_value:
 *                 type: string
 *                 example: "6.7-inch Super AMOLED, 120Hz refresh rate"
 *     responses:
 *       201:
 *         description: Product feature created successfully
 *
 *   get:
 *     summary: Get all product features
 *     tags: [Product Features]
 *     responses:
 *       200:
 *         description: List of all product features
 */

/**
 * @swagger
 * /product-features/{id}:
 *   get:
 *     summary: Get product feature by ID
 *     tags: [Product Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product feature
 *     responses:
 *       200:
 *         description: Product feature data
 *   put:
 *     summary: Update product feature by ID
 *     tags: [Product Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product feature ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feature_name:
 *                 type: string
 *               feature_value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product feature updated
 *   delete:
 *     summary: Delete product feature by ID
 *     tags: [Product Features]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product feature ID
 *     responses:
 *       200:
 *         description: Product feature deleted
 */

import express from "express";
import {
  createProductFeature,
  getAllProductFeatures,
  getProductFeatureById,
  updateProductFeature,
  deleteProductFeature,
} from "../controllers/productKeyFeatureController.js";

const router = express.Router();

// CRUD routes
router.post("/", createProductFeature);
router.get("/", getAllProductFeatures);
router.get("/:id", getProductFeatureById);
router.put("/:id", updateProductFeature);
router.delete("/:id", deleteProductFeature);

export default router;
