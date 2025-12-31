import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

/**
 * Generate PDF from HTML template
 * @param {string} html - HTML string with placeholders replaced
 * @param {string} fileName - Name of PDF file (e.g., INV-2025-000001.pdf)
 * @returns {string} - file path
 */
export const generateInvoicePDF = async (html, fileName) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  // Create uploads directory if not exists
  const dir = path.join(process.cwd(), "uploads", "invoices");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, fileName);

  await page.pdf({ path: filePath, format: "A4" });

  await browser.close();
  return filePath;
};
