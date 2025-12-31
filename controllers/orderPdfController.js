// backend/controllers/orderPdfController.js
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Order, User, OrderItem, Product } from "../models/index.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportOrdersPdf = async (req, res) => {
  try {
    const { search, status, payment_status, startDate, endDate, orderId } = req.body;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (payment_status) query.payment_status = payment_status;
    if (orderId) query.id = orderId;

    // Fetch orders
    let orders = await Order.findAll({
      where: query,
      include: [
        { model: User, as: "user", attributes: ["name", "email"] },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "productDetails", attributes: ["name", "price"] }]
        }
      ],
      order: [["created_at", "DESC"]],
    });

    // Apply search filter
    if (search) {
      const term = search.toLowerCase();
      orders = orders.filter(o =>
        `${o.order_number} ${o.user?.name} ${o.user?.email}`.toLowerCase().includes(term)
      );
    }

    if (startDate) orders = orders.filter(o => new Date(o.created_at) >= new Date(startDate));
    if (endDate) orders = orders.filter(o => new Date(o.created_at) <= new Date(endDate));

    // --- Load logo safely ---
    let logoDataUrl = "";
    try {
      const logoPath = path.join(__dirname, "../public/Images/1.png");
      const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
      logoDataUrl = `data:image/png;base64,${logoBase64}`;
    } catch (err) {
      console.warn("Logo not found, skipping image in PDF.");
    }

    // --- Build orders table HTML ---
    let ordersTable = `
      <table style="width:100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">Order #</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Customer</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Email</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Items</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Subtotal</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Tax</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Shipping</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Payment</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Method</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Order Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    orders.forEach(order => {
      const subtotal = parseFloat(order.subtotal || 0).toFixed(2);
      const tax = parseFloat(order.tax || 0).toFixed(2);
      const shipping = parseFloat(order.shipping || 0).toFixed(2);
      const total = parseFloat(order.total || 0).toFixed(2);

      ordersTable += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.order_number}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.user?.name || "Unknown"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.user?.email || "N/A"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.items.length}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">$${subtotal}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">$${tax}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">$${shipping}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">$${total}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.status}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.payment_status}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.payment_method || "N/A"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date(order.created_at).toLocaleDateString()}</td>
        </tr>
      `;
    });

    ordersTable += `</tbody></table>`;

    // --- Load HTML template ---
    const templatePath = path.join(process.cwd(), "templates", "orders.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace("{{ORDERS_TABLE}}", ordersTable);
    html = html.replace("{{DATE}}", new Date().toLocaleDateString());
    html = html.replace("{{LOGO}}", logoDataUrl);

    // --- Generate PDF with Puppeteer ---
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "40px", bottom: "40px", left: "40px", right: "40px" },
    });

    await browser.close();

    // --- Send PDF to client ---
    res.setHeader("Content-Disposition", `attachment; filename=orders_${Date.now()}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
