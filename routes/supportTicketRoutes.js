/**
 * @swagger
 * tags:
 *   name: Support Tickets
 *   description: Manage customer support tickets
 *
 * /support-tickets:
 *   post:
 *     summary: Create a new support ticket
 *     tags: [Support Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - subject
 *               - message
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               subject:
 *                 type: string
 *                 example: "Order delay issue"
 *               message:
 *                 type: string
 *                 example: "My order has not arrived yet."
 *               priority:
 *                 type: string
 *                 example: "high"
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *
 *   get:
 *     summary: Get all support tickets
 *     tags: [Support Tickets]
 *     responses:
 *       200:
 *         description: List of support tickets
 *
 * /support-tickets/{id}:
 *   get:
 *     summary: Get support ticket by ID
 *     tags: [Support Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket found
 *
 *   put:
 *     summary: Update support ticket by ID
 *     tags: [Support Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Ticket updated
 *
 *   delete:
 *     summary: Delete support ticket by ID
 *     tags: [Support Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket deleted
 */

import express from "express";
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/supportTicketController.js";

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
