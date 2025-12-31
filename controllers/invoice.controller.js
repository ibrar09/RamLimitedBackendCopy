import { Order, OrderItem, Product, ProductVariant, Invoice, UserAddress, User, Payment } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import { generateInvoiceTemplate } from "../templates/invoiceTemplate.js";

// ------------------------------
// Generate Invoice PDF
// ------------------------------
const generateInvoicePDF = async (invoice) => {
  try {
    console.log("[PDFGeneration] Start generating PDF for invoice:", invoice.invoiceNumber);

    const invoicesDir = path.join("invoices");
    fs.mkdirSync(invoicesDir, { recursive: true });

    const fileName = `Invoice-${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Use template
    generateInvoiceTemplate(doc, invoice);

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        console.log("[PDFGeneration] PDF generated successfully:", filePath);
        resolve(filePath);
      });
      writeStream.on("error", (err) => {
        console.error("[PDFGeneration] PDF generation failed:", err);
        reject(err);
      });
    });

  } catch (error) {
    console.error("[PDFGeneration] Unexpected error:", error);
    throw error;
  }
};

// ------------------------------
// Create Invoice After Payment
// ------------------------------
export const createInvoiceAfterPayment = async (req, res) => {
  const { orderNumber } = req.body;
  console.log("[InvoiceController] Request received for orderNumber:", orderNumber);

  if (!orderNumber) {
    console.error("[InvoiceController] orderNumber missing in request body");
    return res.status(400).json({ error: "orderNumber is required" });
  }

  try {
    const order = await Order.findOne({
      where: { order_number: orderNumber },
      include: [
        { association: "items", include: [{ model: Product, as: "productDetails" }, { model: ProductVariant, as: "variant" }] },
        { association: "shippingAddress" },
        { model: User, as: "user" }
      ],
    });

    console.log("[InvoiceController] Order fetched from DB:", order ? order.toJSON() : "Not found");
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Check if invoice exists
    let invoice = await Invoice.findOne({ where: { orderId: order.id } });
    if (invoice) {
      console.log("[InvoiceController] Invoice already exists:", invoice.invoiceNumber);
      return res.status(200).json({ invoice });
    }

    // Map items
    const items = order.items.map(item => ({
      item_id: item.id,
      product_name: item.productDetails?.name || "Unknown",
      product_image: item.productDetails?.image_urls ? JSON.parse(item.productDetails.image_urls)[0] : "",
      sku: item.productDetails?.sku || "-",
      variant_name: item.variant?.variant_name || "-",
      variant_value: item.variant?.variant_value || "-",
      quantity: item.quantity,
      unit_price: Number(item.price || item.productDetails?.price || 0),
      total_price: (item.quantity * (item.price || item.productDetails?.price || 0)).toFixed(2),
    }));

    // Billing info
    const billing = order.shippingAddress || {};
    const billingName = billing.full_name || order.user?.name || "Unknown";
    const billingEmail = billing.email || order.user?.email || "-";
    const billingPhone = billing.phone || order.user?.phone || "-";

    let billingAddressParts = [];
    if (billing) {
      if (billing.address_line1 && billing.address_line1 !== "No Address Provided") billingAddressParts.push(billing.address_line1);
      if (billing.address_line2) billingAddressParts.push(billing.address_line2);
      if (billing.city) billingAddressParts.push(billing.city);
      if (billing.state) billingAddressParts.push(billing.state);
      if (billing.postal_code) billingAddressParts.push(billing.postal_code);
      if (billing.country) billingAddressParts.push(billing.country);
    }
    const billingAddress = billingAddressParts.join(", ") || "No Address Provided";

    const subtotal = parseFloat(order.subtotal || items.reduce((sum, i) => sum + parseFloat(i.total_price), 0));
    const vatPercentage = 15;
    const vatAmount = parseFloat((subtotal * vatPercentage / 100).toFixed(2));
    const grandTotal = parseFloat(order.total || subtotal + vatAmount);

    // Create invoice
    invoice = await Invoice.create({
      id: uuidv4(),
      invoiceNumber: `INV-${Date.now()}`,
      orderId: order.id,
      userId: order.user_id,
      billingName,
      billingEmail,
      billingPhone,
      billingAddress,
      billingCity: billing.city || "-",
      billingCountry: billing.country || "-",
      billingZip: billing.postal_code || "-",
      items,
      subtotal,
      vatPercentage,
      vatAmount,
      shippingFee: order.shipping || 0,
      discount: order.discount || 0,
      grandTotal,
      currency: "SAR",
      paymentMethod: order.payment_method || "-",
      paymentStatus: order.payment_status || "unpaid",
      pdfUrl: null,
    });

    console.log("[InvoiceController] Invoice created in DB:", invoice.toJSON());
    return res.status(201).json({ invoice });

  } catch (err) {
    console.error("[InvoiceController] Create Invoice Error:", err);
    return res.status(500).json({ error: err.message || "Failed to create invoice" });
  }
};

// ------------------------------
// Download Invoice PDF
// ------------------------------
export const downloadInvoicePDF = async (req, res) => {
  const { orderId } = req.params;
  console.log("[InvoiceController] Download invoice request for orderId:", orderId);

  try {
    const invoice = await Invoice.findOne({ where: { orderId } });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        { association: "items", include: [{ model: Product, as: "productDetails" }, { model: ProductVariant, as: "variant" }] },
        { association: "shippingAddress" },
        { model: User, as: "user" }
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Recompute billing info
    const billing = order.shippingAddress || {};
    const billingName = billing.full_name || order.user?.name || "Unknown";
    const billingEmail = billing.email || order.user?.email || "-";
    const billingPhone = billing.phone || order.user?.phone || "-";

    let billingAddressParts = [];
    if (billing) {
      if (billing.address_line1 && billing.address_line1 !== "No Address Provided") billingAddressParts.push(billing.address_line1);
      if (billing.address_line2) billingAddressParts.push(billing.address_line2);
      if (billing.city) billingAddressParts.push(billing.city);
      if (billing.state) billingAddressParts.push(billing.state);
      if (billing.postal_code) billingAddressParts.push(billing.postal_code);
      if (billing.country) billingAddressParts.push(billing.country);
    }
    const billingAddress = billingAddressParts.join(", ") || "No Address Provided";

    const invoiceData = {
      ...invoice.toJSON(),
      items: order.items.map(item => ({
        product_name: item.productDetails?.name || "Unknown",
        product_image: item.productDetails?.image_urls ? JSON.parse(item.productDetails.image_urls)[0] : "",
        sku: item.productDetails?.sku || "-",
        variant_name: item.variant?.variant_name || "-",
        variant_value: item.variant?.variant_value || "-",
        quantity: item.quantity,
        unit_price: Number(item.price || item.productDetails?.price || 0),
        total_price: (item.quantity * (item.price || item.productDetails?.price || 0)).toFixed(2),
      })),
      billingName,
      billingEmail,
      billingPhone,
      billingAddress,
      billingCity: billing.city || "-",
      billingCountry: billing.country || "-",
      billingZip: billing.postal_code || "-",
      subtotal: order.items.reduce((sum, i) => sum + Number(i.total), 0),
      vatPercentage: 15,
      vatAmount: order.items.reduce((sum, i) => sum + Number(i.total), 0) * 0.15,
      shippingFee: order.shipping || 0,
      discount: order.discount || 0,
      grandTotal: order.items.reduce((sum, i) => sum + Number(i.total), 0) * 1.15,
    };

    const filePath = await generateInvoicePDF(invoiceData);

    if (!invoice.pdfUrl) {
      invoice.pdfUrl = filePath;
      await invoice.save();
      console.log("[InvoiceController] PDF URL updated in invoice DB:", filePath);
    }

    res.download(path.resolve(filePath), `Invoice-${invoice.invoiceNumber}.pdf`);

  } catch (error) {
    console.error("[InvoiceController] Download Invoice Error:", error);
    res.status(500).json({ message: "Failed to download invoice" });
  }
};
