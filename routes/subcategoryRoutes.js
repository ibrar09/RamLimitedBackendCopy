// routes/subcategoryRoutes.js
import express from "express";
import {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory
} from "../controllers/subcategoryController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subcategories
 *   description: Subcategory management
 */

/**
 * @swagger
 * /api/v1/subcategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Subcategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 */
router.post("/", createSubcategory);

/**
 * @swagger
 * /api/v1/subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Subcategories]
 *     responses:
 *       200:
 *         description: List of subcategories
 */
router.get("/", getAllSubcategories);

/**
 * @swagger
 * /api/v1/subcategories/{id}:
 *   get:
 *     summary: Get a subcategory by ID
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory data
 *       404:
 *         description: Subcategory not found
 */
router.get("/:id", getSubcategoryById);

/**
 * @swagger
 * /api/v1/subcategories/{id}:
 *   put:
 *     summary: Update a subcategory
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 */
router.put("/:id", updateSubcategory);

/**
 * @swagger
 * /api/v1/subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory
 *     tags: [Subcategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 */
router.delete("/:id", deleteSubcategory);

export default router;
