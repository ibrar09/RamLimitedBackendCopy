import express from "express";
import {
  createSubcategoryItem,
  getAllSubcategoryItems,
  getSubcategoryItemById,
  updateSubcategoryItem,
  deleteSubcategoryItem,
} from "../controllers/subcategoryItemController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subcategory Items
 *   description: Subcategory item management
 */

/**
 * @swagger
 * /api/v1/subcategory-items:
 *   post:
 *     summary: Create a new subcategory item
 *     tags: [Subcategory Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subcategoryId
 *             properties:
 *               name:
 *                 type: string
 *               subcategoryId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcategory item created successfully
 */
router.post("/", createSubcategoryItem);

/**
 * @swagger
 * /api/v1/subcategory-items:
 *   get:
 *     summary: Get all subcategory items
 *     tags: [Subcategory Items]
 *     responses:
 *       200:
 *         description: List of subcategory items
 */
router.get("/", getAllSubcategoryItems);

/**
 * @swagger
 * /api/v1/subcategory-items/{id}:
 *   get:
 *     summary: Get a subcategory item by ID
 *     tags: [Subcategory Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subcategory Item ID
 *     responses:
 *       200:
 *         description: Subcategory item data
 *       404:
 *         description: Subcategory item not found
 */
router.get("/:id", getSubcategoryItemById);

/**
 * @swagger
 * /api/v1/subcategory-items/{id}:
 *   put:
 *     summary: Update a subcategory item
 *     tags: [Subcategory Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subcategory Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               subcategoryId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategory item updated successfully
 */
router.put("/:id", updateSubcategoryItem);

/**
 * @swagger
 * /api/v1/subcategory-items/{id}:
 *   delete:
 *     summary: Delete a subcategory item
 *     tags: [Subcategory Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subcategory Item ID
 *     responses:
 *       200:
 *         description: Subcategory item deleted successfully
 */
router.delete("/:id", deleteSubcategoryItem);

export default router;
