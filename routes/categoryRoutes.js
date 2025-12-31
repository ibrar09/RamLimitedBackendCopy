/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *               description:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *               slug:
 *                 type: string
 *               image_url:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */

/**
 * @swagger
 * /api/v1/categories/search:
 *   get:
 *     summary: Search categories by keyword
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search categories
 *     responses:
 *       200:
 *         description: List of matched categories
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category data
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parent_id:
 *                 type: integer
 *               slug:
 *                 type: string
 *               image_url:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */

import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  search
} from "../controllers/categoryController.js";

const router = express.Router();

// ============================
// ROUTES
// ============================

// ✅ Search (keep above :id to avoid route conflict)
router.get("/search", search);

// ✅ Create a new category
router.post("/", createCategory);

// ✅ Get all categories
router.get("/", getAllCategories);

// ✅ Get category by ID
router.get("/:id", getCategoryById);

// ✅ Update category
router.put("/:id", updateCategory);

// ✅ Delete category
router.delete("/:id", deleteCategory);

export default router;
