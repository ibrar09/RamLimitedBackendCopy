// routes/quotationRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotationStatus,
  deleteQuotation,
} from "../controllers/quotationController.js";

const router = express.Router();

// ---------------------------------------------
// 📂 Ensure upload directory exists
// ---------------------------------------------
const uploadDir = path.join("uploads", "quotations");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ---------------------------------------------
// 📸 Multer configuration
// ---------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // sanitize filename: remove spaces/special chars
    const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only .jpg, .jpeg, and .png files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/**
 * @swagger
 * tags:
 *   name: Quotations
 *   description: Manage user quotation requests
 */

/**
 * @swagger
 * /api/v1/quotations:
 *   post:
 *     summary: Create a new quotation
 *     tags: [Quotations]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               serviceRequired:
 *                 type: string
 *               projectType:
 *                 type: string
 *               estimatedArea:
 *                 type: string
 *               preferredDate:
 *                 type: string
 *               contactName:
 *                 type: string
 *               company:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *               projectDetails:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Quotation created successfully
 */
router.post("/", upload.array("files", 5), createQuotation);

/**
 * @swagger
 * /api/v1/quotations:
 *   get:
 *     summary: Get all quotations
 *     tags: [Quotations]
 *     responses:
 *       200:
 *         description: List of quotations
 */
router.get("/", getAllQuotations);

/**
 * @swagger
 * /api/v1/quotations/{id}:
 *   get:
 *     summary: Get quotation by ID
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quotation details
 */
router.get("/:id", getQuotationById);

/**
 * @swagger
 * /api/v1/quotations/{id}:
 *   put:
 *     summary: Update quotation status
 *     tags: [Quotations]
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
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, approved, rejected]
 *     responses:
 *       200:
 *         description: Quotation status updated
 */
router.put("/:id", updateQuotationStatus);

/**
 * @swagger
 * /api/v1/quotations/{id}:
 *   delete:
 *     summary: Delete a quotation
 *     tags: [Quotations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quotation deleted
 */
router.delete("/:id", deleteQuotation);

export default router;
