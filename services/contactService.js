// src/services/contactService.js
import { Contact } from "../models/index.js";
import { sendMail , transporter } from "../utils/email.js";

/**
 * 🔹 Create a new contact
 * - Saves to DB
 * - Sends email notification
 */

export const createContact = async (data) => {
  // 1️⃣ Save to database
  const contact = await Contact.create(data);
  console.log("✅ Contact saved to DB:", contact);

  // 2️⃣ Send email notification
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

  if (!receiverEmail) {
    console.error("❌ CONTACT_RECEIVER_EMAIL is not set in .env!");
    throw new Error("Recipient email not configured.");
  }

  try {
    const mailOptions = {
      from: `"Web App" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone}</p>
        <p><strong>Service Needed:</strong> ${contact.serviceneeded}</p>
        <p><strong>Message:</strong> ${contact.message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Contact email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send contact email:", error);
  }

  return contact;
};
/**
 * 🔹 Get all contacts
 */
export const getAllContacts = async () => {
  console.log("🔹 [ContactService] Fetching all contacts...");
  const contacts = await Contact.findAll({ order: [["created_at", "DESC"]] });
  console.log(`✅ [ContactService] Retrieved ${contacts.length} contacts`);
  return contacts;
};

/**
 * 🔹 Get contact by ID
 */
export const getContactById = async (id) => {
  console.log(`🔹 [ContactService] Fetching contact ID: ${id}`);
  return await Contact.findByPk(id);
};

/**
 * 🔹 Update contact by ID
 */
export const updateContact = async (id, data) => {
  console.log(`🔹 [ContactService] Updating contact ID: ${id} with data:`, data);
  const contact = await Contact.findByPk(id);
  if (!contact) throw new Error("Contact not found");
  const updated = await contact.update(data);
  console.log("✅ [ContactService] Contact updated:", updated.toJSON());
  return updated;
};

/**
 * 🔹 Delete contact by ID
 */
export const deleteContact = async (id) => {
  console.log(`🔹 [ContactService] Deleting contact ID: ${id}`);
  const contact = await Contact.findByPk(id);
  if (!contact) throw new Error("Contact not found");
  await contact.destroy();
  console.log("✅ [ContactService] Contact deleted");
};
