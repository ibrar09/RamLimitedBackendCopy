// routes/categoryMenu.routes.js
import express from "express";
import { getCategoryMenu } from "../controllers/categoryMenucontroller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/menu:
 *   get:
 *     summary: Get all categories with their subcategories and products
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: Successful response with hierarchical category menu
 *         content:
 *           application/json:
 *             example:
 *               - category: "Electronics"
 *                 subcategories:
 *                   - name: "Laptops"
 *                     products:
 *                       - id: 1
 *                         name: "Dell XPS 13"
 *                       - id: 2
 *                         name: "MacBook Pro"
 *                   - name: "Smartphones"
 *                     products:
 *                       - id: 3
 *                         name: "iPhone 15"
 *       500:
 *         description: Server error
 */
router.get("/", getCategoryMenu);

export default router;
