// src/controllers/contactController.js
import * as contactService from "../services/contactService.js";
import { sendMail } from "../utils/email.js"; // your nodemailer setup

// ---------------- CREATE CONTACT + SEND EMAIL ----------------
export const createContactItem = async (req, res) => {
  console.log("🔹 [Contact] Received data:", req.body);

  try {
    // 1️⃣ Save to DB
    const contact = await contactService.createContact(req.body);
    console.log("✅ [Contact] Saved to DB:", contact.toJSON());

    // 2️⃣ Prepare email
    const mailSubject = `New Contact Message from ${contact.name}`;
    const mailBody = `
      Name: ${contact.name}
      Email: ${contact.email}
      Phone: ${contact.phone}
      Service Needed: ${contact.serviceneeded}
      Source: ${contact.source || "website"}
      Message: ${contact.message}
      Created At: ${contact.created_at}
    `;

    console.log("📧 [Contact] Preparing to send email...");

    // 3️⃣ Send email
    const info = await sendMail({
      to: process.env.CONTACT_RECEIVER_EMAIL, // set in your .env
      subject: mailSubject,
      text: mailBody,
    });
    console.log("✅ [Contact] Email sent:", info.messageId);

    // 4️⃣ Respond
    res.status(201).json({ message: "Contact saved and email sent!", contact });
  } catch (error) {
    console.error("❌ [Contact] Error creating contact:", error);
    res.status(500).json({ error: error.message });
  }
};

// ---------------- GET ALL CONTACTS ----------------
export const getContacts = async (req, res) => {
  console.log("🔹 [Contact] Fetching all contacts...");
  try {
    const contacts = await contactService.getAllContacts();
    console.log("✅ [Contact] Fetched contacts:", contacts.length);
    res.status(200).json(contacts);
  } catch (error) {
    console.error("❌ [Contact] Error fetching contacts:", error);
    res.status(500).json({ error: error.message });
  }
};

// ---------------- GET CONTACT BY ID ----------------
export const getContact = async (req, res) => {
  console.log("🔹 [Contact] Fetching contact ID:", req.params.id);
  try {
    const contact = await contactService.getContactById(req.params.id);
    if (!contact) {
      console.warn("⚠️ [Contact] Contact not found");
      return res.status(404).json({ error: "Not found" });
    }
    console.log("✅ [Contact] Found contact:", contact.toJSON());
    res.status(200).json(contact);
  } catch (error) {
    console.error("❌ [Contact] Error fetching contact:", error);
    res.status(500).json({ error: error.message });
  }
};

// ---------------- UPDATE CONTACT ----------------
export const updateContactItem = async (req, res) => {
  console.log("🔹 [Contact] Updating contact ID:", req.params.id, "with data:", req.body);
  try {
    const contact = await contactService.updateContact(req.params.id, req.body);
    console.log("✅ [Contact] Updated contact:", contact.toJSON());
    res.status(200).json(contact);
  } catch (error) {
    console.error("❌ [Contact] Error updating contact:", error);
    res.status(500).json({ error: error.message });
  }
};

// ---------------- DELETE CONTACT ----------------
export const deleteContactItem = async (req, res) => {
  console.log("🔹 [Contact] Deleting contact ID:", req.params.id);
  try {
    await contactService.deleteContact(req.params.id);
    console.log("✅ [Contact] Contact deleted");
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.error("❌ [Contact] Error deleting contact:", error);
    res.status(500).json({ error: error.message });
  }
};
