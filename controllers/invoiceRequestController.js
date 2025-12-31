// backend/controllers/invoiceRequestController.js
import path from "path";
import fs from "fs";
import { InvoiceRequest, Order, User, sequelize } from "../models/index.js";
import { sendInvoiceEmail } from "../utils/email.js"; // optional

// ------------------ User requests an invoice ------------------ //
export const requestInvoice = async (req, res) => {
  try {
    const { order_id } = req.body;
    const userId = req.user.id;

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const existingRequest = await InvoiceRequest.findOne({
      where: { orderId: order_id, userId },
    });

    if (existingRequest) {
      return res.status(200).json({
        message: "Invoice request already exists",
        invoiceRequest: existingRequest,
      });
    }

    const invoiceRequest = await InvoiceRequest.create({
      orderId: order_id,
      userId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Invoice request created",
      invoiceRequest,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ------------------ Admin uploads/sends PDF invoice ------------------ //
export const sendInvoicePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const invoiceRequest = await InvoiceRequest.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Order, attributes: ["id", "order_number", "total"] },
      ],
    });

    if (!invoiceRequest) {
      return res.status(404).json({ message: "Invoice request not found" });
    }

    // ✅ Update invoice request
    invoiceRequest.pdfPath = `uploads/invoices/${file.filename}`;
    invoiceRequest.status = "sent";
    invoiceRequest.sentAt = new Date();

    await invoiceRequest.save();

    // ✅ Send invoice email AFTER status becomes "sent"
    if (invoiceRequest.User?.email && invoiceRequest.pdfPath) {
      await sendInvoiceEmail(
        invoiceRequest.User.email,
        invoiceRequest.pdfPath
      );
    }

    return res.status(200).json({
      success: true,
      message: "Invoice sent successfully",
      invoiceRequest,
    });
  } catch (err) {
    console.error("Send invoice error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------ Admin fetch all invoice requests ------------------ //
export const getInvoiceRequests = async (req, res) => {
  try {
    const invoiceRequests = await InvoiceRequest.findAll({
      attributes: [
        "id",
        "invoiceNumber",
        "orderId",
        "userId",
        "status",
        "pdfPath",
        "requestedAt",
        "sentAt",
      ],
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Order, attributes: ["id", "order_number", "total"] },
      ],
      order: [["requestedAt", "DESC"]],
    });

    return res.status(200).json({ success: true, data: invoiceRequests });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice requests",
      error: err.message,
    });
  }
};


// ------------------ User downloads PDF ------------------ //
export const downloadInvoicePDF = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Missing or invalid token." });
    }

    const { id } = req.params;
    const userId = req.user.id;

    // Find invoice request belonging to this user and is sent
    const invoiceRequest = await InvoiceRequest.findOne({
      where: { id, userId, status: "sent" },
    });

    if (!invoiceRequest) {
      return res.status(404).json({ message: "Invoice request not found or not sent yet." });
    }

    if (!invoiceRequest.pdfPath) {
      return res.status(404).json({ message: "Invoice PDF not uploaded yet." });
    }

    const pdfPath = path.resolve(invoiceRequest.pdfPath);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "Invoice PDF missing on server." });
    }

    // ✅ Send the file
    return res.download(pdfPath, `Invoice-${invoiceRequest.id}.pdf`, (err) => {
      if (err) {
        console.error("Error sending PDF:", err);
        return res.status(500).json({ message: "Failed to send invoice PDF." });
      }
    });
  } catch (err) {
    console.error("Download invoice error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
// ------------------ Fetch invoice request by order for user ------------------ //
export const getInvoiceRequestByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const invoiceRequest = await InvoiceRequest.findOne({
      where: { orderId, userId },
    });

    if (!invoiceRequest) {
      return res.json({ success: true, data: null });
    }

    return res.json({
      success: true,
      data: {
        id: invoiceRequest.id,
        status: invoiceRequest.status,
        pdf_path: invoiceRequest.pdfPath
          ? `/api/v1/invoice-request/download/${invoiceRequest.id}`
          : null,
        requested_at: invoiceRequest.requestedAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch invoice request" });
  }
};
