import db from "../models/index.js";
import path from "path";
import fs from "fs";

const InvoiceRequest = db.InvoiceRequest;
const User = db.User;
const Order = db.Order;

// Create new invoice request
export const createInvoiceRequest = async ({ orderId, userId }) => {
  const existingRequest = await InvoiceRequest.findOne({
    where: { orderId, userId, status: "pending" },
  });

  if (existingRequest) {
    throw new Error("You already have a pending invoice request for this order.");
  }

  const request = await InvoiceRequest.create({ orderId, userId });
  return request;
};

// Admin upload PDF and send
export const uploadInvoicePDF = async ({ requestId, pdfFile, invoiceNumber }) => {
  const request = await InvoiceRequest.findByPk(requestId);
  if (!request) throw new Error("Invoice request not found.");

  // Save PDF to /uploads/invoices/
  const uploadDir = path.join(process.cwd(), "uploads/invoices");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const pdfPath = path.join(uploadDir, `${invoiceNumber}-${requestId}.pdf`);
  fs.writeFileSync(pdfPath, pdfFile.buffer);

  request.pdfPath = pdfPath;
  request.invoiceNumber = invoiceNumber;
  request.status = "sent";
  request.sentAt = new Date();
  await request.save();

  return request;
};

// List all invoice requests for admin
export const listInvoiceRequests = async () => {
  return InvoiceRequest.findAll({ include: [User, Order], order: [["createdAt", "DESC"]] });
};

// List user-specific invoice requests
export const listUserInvoiceRequests = async (userId) => {
  return InvoiceRequest.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
};
