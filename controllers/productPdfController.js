// backend/controllers/productsPdfController.js
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Product, Category, Brand } from "../models/index.js"; // adjust your models

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportProductsPdf = async (req, res) => {
  try {
    const { search, categoryId, brandId, stockMin, stockMax } = req.body;

    // Build query
    const query = {};
    if (categoryId) query.category_id = categoryId;
    if (brandId) query.brand_id = brandId;

    // Fetch products
    let products = await Product.findAll({
      where: query,
      include: [
        { model: Category, as: "category", attributes: ["name"] },
        { model: Brand, as: "brand", attributes: ["name"] },
      ],
      order: [["created_at", "DESC"]],
    });

    // Apply search filter
    if (search) {
      const term = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term)
      );
    }

    if (stockMin !== undefined) products = products.filter(p => p.stock >= stockMin);
    if (stockMax !== undefined) products = products.filter(p => p.stock <= stockMax);

    // --- Load logo safely ---
    let logoDataUrl = "";
    try {
      const logoPath = path.join(__dirname, "../public/Images/1.png");
      const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
      logoDataUrl = `data:image/png;base64,${logoBase64}`;
    } catch (err) {
      console.warn("Logo not found, skipping image in PDF.");
    }

    // --- Build products table HTML ---
    let productsTable = `
      <table style="width:100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Image</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Category</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Brand</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Old Price</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Stock</th>
          </tr>
        </thead>
        <tbody>
    `;

    products.forEach(p => {
      const imageUrl = Array.isArray(p.image_urls) && p.image_urls[0]
        ? p.image_urls[0].startsWith("http")
          ? p.image_urls[0]
          : `${req.protocol}://${req.get("host")}${p.image_urls[0]}`
        : null;

      productsTable += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.id}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            ${imageUrl ? `<img src="${imageUrl}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;" />` : "-"}
          </td>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.name}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.category?.name || "-"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.brand?.name || "-"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">$${p.price}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.oldprice || "-"}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${p.stock}</td>
        </tr>
      `;
    });

    productsTable += `</tbody></table>`;

    // --- Load HTML template ---
    const templatePath = path.join(process.cwd(), "templates", "products.html");
    let html = fs.readFileSync(templatePath, "utf8");
    html = html.replace("{{PRODUCTS_TABLE}}", productsTable);
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
    res.setHeader("Content-Disposition", `attachment; filename=products_${Date.now()}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);

  } catch (err) {
    console.error("PRODUCT PDF ERROR:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
