// routes/productDetailRoutes.js
import express from "express";
import {
  createProductDetail,
  getProductDetailById,
  updateProductDetail,
  deleteProductDetail,
} from "../controllers/productDetailController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProductDetails
 *   description: Manage product details
 */

/**
 * @swagger
 * /product-details:
 *   post:
 *     summary: Create a new product detail
 *     tags: [ProductDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *             properties:
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               feature:
 *                 type: string
 *               model_number:
 *                 type: string
 *               payment:
 *                 type: string
 *               usage:
 *                 type: string
 *               delivery_time:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product detail created successfully
 */
router.post("/", createProductDetail);

/**
 * @swagger
 * /product-details/{id}:
 *   get:
 *     summary: Get product detail by ID
 *     tags: [ProductDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product detail object
 *       404:
 *         description: Not found
 */
router.get("/:id", getProductDetailById);

/**
 * @swagger
 * /product-details/{id}:
 *   put:
 *     summary: Update product detail
 *     tags: [ProductDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put("/:id", updateProductDetail);

/**
 * @swagger
 * /product-details/{id}:
 *   delete:
 *     summary: Delete product detail
 *     tags: [ProductDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete("/:id", deleteProductDetail);

export default router;
