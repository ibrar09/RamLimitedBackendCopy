import express from "express";
import {
  getAllProjectsController,
  getProjectByIdController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
  getProjectBySlugController,
} from "../controllers/projectController.js";
import { projectUpload } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* -------------------------------------
   🧩 SWAGGER DOCUMENTATION
------------------------------------- */

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management endpoints (with image upload)
 */

/* -------------------------------------
   🚀 ROUTES
------------------------------------- */

// Get all projects
/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get("/", getAllProjectsController);

// Get a single project by ID
/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Get a single project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get("/slug/:slug", getProjectBySlugController);
router.get("/:id", getProjectByIdController);

// Create a new project with optional multiple file uploads
/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create a new project (with multiple image uploads)
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               client: { type: string }
 *               year: { type: integer }
 *               duration: { type: string }
 *               budget: { type: number }
 *               featured: { type: boolean }
 *               description: { type: string }
 *               image: { type: string, format: binary }
 *               images: 
 *                 type: array
 *                 items: { type: string, format: binary }
 *               testimonialImage: { type: string, format: binary }
 *               challengeSolution: { type: string, example: '[{"type":"challenge","title":"Challenge"}]' }
 *               testimonial: { type: string, example: '{"quote":"Great work!","name":"John"}' }
 *               investment: { type: string, example: '{"price":100,"currency":"SAR"}' }
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", projectUpload, createProjectController);

// Update an existing project (optional file uploads)
router.put("/:id", projectUpload, updateProjectController);

// Delete a project
router.delete("/:id", deleteProjectController);

/* -------------------------------------
   🔹 EXPORT ROUTER
------------------------------------- */
export default router;
