import express from "express";
import { createCV, getAllCVs, getCVById, updateCV, deleteCV } from "../controllers/cvController.js";
import multer from "multer";

const router = express.Router();

// ---------------- MULTER SETUP ---------------- //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ---------------- SWAGGER TAG ---------------- //
/**
 * @swagger
 * tags:
 *   name: CV
 *   description: CV submission and management
 */

// ---------------- CREATE CV ---------------- //
/**
 * @swagger
 * /api/v1/cvs:
 *   post:
 *     summary: Submit a new CV
 *     tags: [CV]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *       - in: formData
 *         name: phone
 *         type: string
 *         required: true
 *       - in: formData
 *         name: experience
 *         type: string
 *         required: true
 *       - in: formData
 *         name: position
 *         type: string
 *         required: true
 *       - in: formData
 *         name: message
 *         type: string
 *       - in: formData
 *         name: resume
 *         type: file
 *         required: true
 *     responses:
 *       201:
 *         description: CV submitted successfully
 *       400:
 *         description: Resume file is required
 *       500:
 *         description: Server error
 */
router.post("/", upload.single("resume"), createCV);

// ---------------- GET ALL CVs ---------------- //
/**
 * @swagger
 * /api/v1/cvs:
 *   get:
 *     summary: Get all CVs
 *     tags: [CV]
 *     responses:
 *       200:
 *         description: List of all CVs
 *       500:
 *         description: Server error
 */
router.get("/", getAllCVs);

// ---------------- GET CV BY ID ---------------- //
/**
 * @swagger
 * /api/v1/cvs/{id}:
 *   get:
 *     summary: Get CV by ID
 *     tags: [CV]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: CV data
 *       404:
 *         description: CV not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getCVById);

// ---------------- UPDATE CV ---------------- //
/**
 * @swagger
 * /api/v1/cvs/{id}:
 *   put:
 *     summary: Update a CV
 *     tags: [CV]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *       - in: formData
 *         name: name
 *         type: string
 *       - in: formData
 *         name: email
 *         type: string
 *       - in: formData
 *         name: phone
 *         type: string
 *       - in: formData
 *         name: experience
 *         type: string
 *       - in: formData
 *         name: position
 *         type: string
 *       - in: formData
 *         name: message
 *         type: string
 *       - in: formData
 *         name: resume
 *         type: file
 *     responses:
 *       200:
 *         description: CV updated successfully
 *       404:
 *         description: CV not found
 *       500:
 *         description: Server error
 */
router.put("/:id", upload.single("resume"), updateCV);

// ---------------- DELETE CV ---------------- //
/**
 * @swagger
 * /api/v1/cvs/{id}:
 *   delete:
 *     summary: Delete a CV
 *     tags: [CV]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: CV deleted successfully
 *       404:
 *         description: CV not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteCV);

export default router;
