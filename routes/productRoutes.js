// src/routes/productRoutes.js
import express from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductBySlug,
  uploadMultiple,
} from "../controllers/productController.js";
import { exportProductsPdf } from "../controllers/productPdfController.js";

const router = express.Router();

console.log("🛠️ [Backend] Initializing productRoutes...");

/* ------------------- MULTER CONFIG ------------------- */
// Use memory storage for Cloudinary (stores files in buffer)
// Falls back to disk storage if Cloudinary fails
const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// Use memory storage for upload route (Cloudinary needs buffer)
const uploadMemory = multer({ storage: memoryStorage });
const uploadDisk = multer({ storage: diskStorage });

// ✅ Hybrid storage fallback route - Moved to top for priority
router.post("/upload-multiple", (req, res, next) => {
  console.log("🔗 [Backend] Route hit: POST /api/v1/products/upload-multiple");
  next();
}, uploadMemory.array("images"), uploadMultiple);


/* ------------------- PARSE KEY FEATURES MIDDLEWARE ------------------- */
const parseKeyFeatures = (req, res, next) => {
  try {
    if (req.body.key_features && typeof req.body.key_features === "string") {
      req.body.key_features = JSON.parse(req.body.key_features);
    }
  } catch {
    req.body.key_features = [];
  }
  next();
};

/* ======================================================
   SWAGGER DOCUMENTATION
   ====================================================== */



/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/v1/products/search:
 *   get:
 *     summary: Search products by name, category, or brand
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term
 *     responses:
 *       200:
 *         description: List of matching products
 */
router.get("/search", searchProducts);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               oldprice:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               brand_id:
 *                 type: integer
 *               subcategory:
 *                 type: string
 *               key_features:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, discontinued]
 *               is_new_release:
 *                 type: boolean
 *               is_best_seller:
 *                 type: boolean
 *               is_hot_deal:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *         description: Product created successfully
 */
router.post("/", uploadMemory.array("images"), parseKeyFeatures, createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               oldprice:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               brand_id:
 *                 type: integer
 *               subcategory:
 *                 type: string
 *               key_features:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, discontinued]
 *               is_new_release:
 *                 type: boolean
 *               is_best_seller:
 *                 type: boolean
 *               is_hot_deal:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               material:
 *                 type: string
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
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
router.put("/:id", uploadMemory.array("images"), parseKeyFeatures, updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", deleteProduct);

// Route moved to top


router.post("/products/pdf", exportProductsPdf);

export default router;
