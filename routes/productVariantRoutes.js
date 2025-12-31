// routes/productVariantRoutes.js
/**
 * @swagger
 * tags:
 *   name: Product Variants
 *   description: API endpoints for managing product variants
 */

/**
 * @swagger
 * /api/v1/product-variants:
 *   post:
 *     summary: Create a new product variant
 *     tags: [Product Variants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - variant_name
 *               - variant_value
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               variant_name:
 *                 type: string
 *                 example: "Color"
 *               variant_value:
 *                 type: string
 *                 example: "Red"
 *               additional_price:
 *                 type: number
 *                 example: 10.5
 *               stock:
 *                 type: integer
 *                 example: 50
 *               sku:
 *                 type: string
 *                 example: "RED-XL-001"
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variant created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *   get:
 *     summary: Get all product variants
 *     tags: [Product Variants]
 *     responses:
 *       200:
 *         description: List of all variants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductVariant'
 */

/**
 * @swagger
 * /api/v1/product-variants/product/{product_id}:
 *   get:
 *     summary: Get variants by product ID
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: List of variants for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductVariant'
 */

/**
 * @swagger
 * /api/v1/product-variants/{id}:
 *   put:
 *     summary: Update variant by ID
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variant_name:
 *                 type: string
 *               variant_value:
 *                 type: string
 *               additional_price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               sku:
 *                 type: string
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variant updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *   delete:
 *     summary: Delete variant by ID
 *     tags: [Product Variants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variant deleted successfully"
 */

import express from "express";
import {
  createVariant,
  getAllVariants,
  getVariantsByProductId,
  updateVariant,
  deleteVariant,
} from "../controllers/productVariantController.js";

const router = express.Router();

// Base route: /api/v1/product-variants
router.post("/", createVariant);                         // Create variant
router.get("/", getAllVariants);                        // Get all variants
router.get("/product/:product_id", getVariantsByProductId); // Get variants by product ID
router.put("/:id", updateVariant);                      // Update variant by ID
router.delete("/:id", deleteVariant);                   // Delete variant by ID

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 1
 *         variant_name:
 *           type: string
 *           example: "Color"
 *         variant_value:
 *           type: string
 *           example: "Red"
 *         additional_price:
 *           type: number
 *           example: 10.5
 *         stock:
 *           type: integer
 *           example: 50
 *         sku:
 *           type: string
 *           example: "RED-XL-001"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-23T08:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-12-23T08:30:00Z"
 */
