/**
 * @swagger
 * tags:
 *   name: ProductImages
 *   description: Product image management
 */

/**
 * @swagger
 * /product-images:
 *   post:
 *     summary: Add a new product image
 *     tags: [ProductImages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - image_url
 *             properties:
 *               product_id:
 *                 type: integer
 *               image_url:
 *                 type: string
 *               alt_text:
 *                 type: string
 *               is_primary:
 *                 type: boolean
 *               sort_order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product image created
 */

/**
 * @swagger
 * /product-images:
 *   get:
 *     summary: Get all product images
 *     tags: [ProductImages]
 *     responses:
 *       200:
 *         description: List of product images
 */

/**
 * @swagger
 * /product-images/product/{productId}:
 *   get:
 *     summary: Get images for a specific product
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of images for product
 */

/**
 * @swagger
 * /product-images/{id}:
 *   put:
 *     summary: Update a product image
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image_url:
 *                 type: string
 *               alt_text:
 *                 type: string
 *               is_primary:
 *                 type: boolean
 *               sort_order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated product image
 */

/**
 * @swagger
 * /product-images/{id}:
 *   delete:
 *     summary: Delete a product image
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product image deleted
 */
import express from "express";
import * as productImageController from "../controllers/productImageController.js";

const router = express.Router();

router.post("/", productImageController.createProductImage);
router.get("/", productImageController.getAllProductImages);
router.get("/product/:productId", productImageController.getProductImagesByProductId);
router.put("/:id", productImageController.updateProductImage);
router.delete("/:id", productImageController.deleteProductImage);

export default router;
