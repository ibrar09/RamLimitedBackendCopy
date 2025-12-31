/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Manage customer contacts
 *
 * /api/v1/contacts:
 *   post:
 *     summary: Create a contact message (saves to DB and sends email)
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "+966500000000"
 *               message:
 *                 type: string
 *                 example: "I need help with my order."
 *               serviceneeded:
 *                 type: string
 *                 example: "Shipping Issue"
 *               source:
 *                 type: string
 *                 example: "website"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of contacts
 *       500:
 *         description: Internal server error
 *
 * /api/v1/contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact found
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update contact by ID
 *     tags: [Contacts]
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
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       500:
 *         description: Internal server error
 */

import express from "express";
import {
  createContactItem,
  getContacts,
  getContact,
  updateContactItem,
  deleteContactItem,
} from "../controllers/contactController.js";

const router = express.Router();

// CRUD Routes
router.post("/", createContactItem);       // POST /api/v1/contacts
router.get("/", getContacts);              // GET /api/v1/contacts
router.get("/:id", getContact);            // GET /api/v1/contacts/:id
router.put("/:id", updateContactItem);     // PUT /api/v1/contacts/:id
router.delete("/:id", deleteContactItem);  // DELETE /api/v1/contacts/:id

export default router;
