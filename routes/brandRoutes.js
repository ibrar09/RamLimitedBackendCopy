import express from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management APIs
 */

/**
 * @swagger
 * /api/v1/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Apple
 *               logo_url:
 *                 type: string
 *                 example: https://example.com/apple.png
 *               description:
 *                 type: string
 *                 example: Premium electronics brand
 *               website:
 *                 type: string
 *                 example: https://www.apple.com
 *               status:
 *                 type: string
 *                 example: active
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", createBrand);

/**
 * @swagger
 * /api/v1/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: List of brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Samsung
 *                   logo_url:
 *                     type: string
 *                     example: https://example.com/samsung.png
 *                   description:
 *                     type: string
 *                     example: Leading electronics brand
 *                   website:
 *                     type: string
 *                     example: https://www.samsung.com
 *                   status:
 *                     type: string
 *                     example: active
 */
router.get("/", getAllBrands);

/**
 * @swagger
 * /api/v1/brands/{id}:
 *   get:
 *     summary: Get a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand details
 *       404:
 *         description: Brand not found
 */
router.get("/:id", getBrandById);

/**
 * @swagger
 * /api/v1/brands/{id}:
 *   put:
 *     summary: Update a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Samsung Electronics
 *               logo_url:
 *                 type: string
 *                 example: https://example.com/samsung-logo.png
 *               description:
 *                 type: string
 *                 example: Updated description for Samsung brand
 *               status:
 *                 type: string
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateBrand);

/**
 * @swagger
 * /api/v1/brands/{id}:
 *   delete:
 *     summary: Delete a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 */
router.delete("/:id", deleteBrand);

export default router;
