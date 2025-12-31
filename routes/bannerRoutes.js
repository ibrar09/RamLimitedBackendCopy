import express from "express";
import * as bannerController from "../controllers/bannerController.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Banners
 *     description: Banner management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       properties:
 *         id: { type: integer, example: 1 }
 *         title: { type: string, example: "Mega Sale" }
 *         subtitle: { type: string, example: "Limited Time Offer" }
 *         image_url: { type: string, example: "/uploads/banner-123.png" }
 *         target_type: { type: string, enum: [product, category, custom], example: "category" }
 *         target_value: { type: string, example: "plumbing" }
 *         active: { type: boolean, example: true }
 *         priority: { type: integer, example: 1 }
 *         start_date: { type: string, format: date-time }
 *         end_date: { type: string, format: date-time }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 *     BannerInput:
 *       type: object
 *       required: [title, target_type]
 *       properties:
 *         title: { type: string, example: "Mega Sale" }
 *         subtitle: { type: string, example: "Limited Time Offer" }
 *         target_type: { type: string, enum: [product, category, custom], example: "category" }
 *         target_value: { type: string, example: "plumbing" }
 *         active: { type: boolean, example: true }
 *         priority: { type: integer, example: 1 }
 *         start_date: { type: string, format: date-time }
 *         end_date: { type: string, format: date-time }
 */

/**
 * @swagger
 * /api/v1/banners:
 *   get:
 *     summary: Get all banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: List of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Banner' }
 */
router.get("/", bannerController.getBanners);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   get:
 *     summary: Get banner by ID
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Banner ID
 *     responses:
 *       200: { description: Banner found, content: { application/json: { schema: { $ref: '#/components/schemas/Banner' }}}}
 *       404: { description: Banner not found }
 */
router.get("/:id", bannerController.getBanner);

/**
 * @swagger
 * /api/v1/banners:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banners]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               subtitle: { type: string }
 *               target_type: { type: string, enum: [product, category, custom] }
 *               target_value: { type: string }
 *               active: { type: boolean }
 *               priority: { type: integer }
 *               start_date: { type: string, format: date-time }
 *               end_date: { type: string, format: date-time }
 *               image: { type: string, format: binary }
 *     responses:
 *       201: { description: Banner created, content: { application/json: { schema: { $ref: '#/components/schemas/Banner' }}}}
 */
router.post("/", upload.single("image"), bannerController.createBanner);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   put:
 *     summary: Update an existing banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Banner ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               subtitle: { type: string }
 *               target_type: { type: string, enum: [product, category, custom] }
 *               target_value: { type: string }
 *               active: { type: boolean }
 *               priority: { type: integer }
 *               start_date: { type: string, format: date-time }
 *               end_date: { type: string, format: date-time }
 *               image: { type: string, format: binary }
 *     responses:
 *       200: { description: Banner updated, content: { application/json: { schema: { $ref: '#/components/schemas/Banner' }}}}
 */
router.put("/:id", upload.single("image"), bannerController.updateBanner);

/**
 * @swagger
 * /api/v1/banners/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Banner ID
 *     responses:
 *       200: { description: Banner deleted successfully, content: { application/json: { schema: { success: true, message: "Banner deleted successfully" }}}}
 */
router.delete("/:id", bannerController.deleteBanner);

export default router;
