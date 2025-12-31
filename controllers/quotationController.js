// controllers/quotationController.js
import { Quotation, QuotationFile } from "../models/index.js";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

// ---------- ESM __dirname fix ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Email transporter ----------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------- Helper: convert file -> data URI ----------
const fileToDataURI = (filePath) => {
  const ext = path.extname(filePath).substring(1).toLowerCase();
  const buffer = fs.readFileSync(filePath);
  let mime;
  if (ext === "jpg" || ext === "jpeg") mime = "image/jpeg";
  else if (ext === "png") mime = "image/png";
  else if (ext === "gif") mime = "image/gif";
  else mime = `application/octet-stream`;
  return `data:${mime};base64,${buffer.toString("base64")}`;
};

// ---------- Create Quotation ----------
export const createQuotation = async (req, res) => {
  const t = await Quotation.sequelize.transaction();
  let browser;
  try {
    const {
      serviceRequired,
      projectType,
      estimatedArea,
      preferredDate,
      contactName,
      company,
      phoneNumber,
      emailAddress,
      projectDetails,
    } = req.body;

    const files = req.files || [];

    // 1) Create quotation record
    const quotation = await Quotation.create(
      {
        service_required: serviceRequired,
        project_type: projectType,
        estimated_area: estimatedArea,
        preferred_date: preferredDate,
        contact_name: contactName,
        company,
        phone_number: phoneNumber,
        email_address: emailAddress,
        project_details: projectDetails,
        status: "pending",
      },
      { transaction: t }
    );

    // 2) Save uploaded files
    for (const file of files) {
      await QuotationFile.create(
        {
          quotation_id: quotation.id,
          file_name: file.originalname || null,
          file_type: file.mimetype || null,
          file_path: `/uploads/quotations/${file.filename}`,
        },
        { transaction: t }
      );
    }

    // 3) Prepare HTML template
    const templatePath = path.join(__dirname, "../templates/quotation-template.html");
    const templateHtml = await fsPromises.readFile(templatePath, "utf8");
    const template = handlebars.compile(templateHtml);

    const imagesData = [];
    for (const file of files) {
      const absolute = path.join(__dirname, "..", "uploads", "quotations", file.filename);
      try {
        const dataUri = fileToDataURI(absolute);
        imagesData.push(dataUri);
      } catch (err) {
        console.warn("Warning: failed to convert file to data URI:", file.filename, err.message);
      }
    }

    const html = template({
      id: quotation.id,
      createdAt: new Date().toLocaleString(),
      serviceRequired,
      projectType,
      estimatedArea,
      preferredDate,
      contactName,
      company,
      phoneNumber,
      emailAddress,
      projectDetails,
      images: imagesData,
      logo: null, // optional logo
    });

    // 4) Generate PDF
    const pdfDir = path.join(__dirname, "..", "uploads", "quotations");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });
    const pdfFilename = `quotation_${quotation.id}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFilename);

    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    // 5) Save PDF path in DB
    quotation.pdf_path = `/uploads/quotations/${pdfFilename}`;
    await quotation.save({ transaction: t });

    await t.commit();

    // 6) Send email (does not block API success)
    try {
      await transporter.sendMail({
        from: `"Quotation Request" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // recipient (admin)
        subject: `New Quotation #${quotation.id} from ${contactName}`,
        text: `New quotation received from ${contactName}. See attached PDF.`,
        attachments: [{ filename: pdfFilename, path: pdfPath }],
      });
      console.log("Email sent successfully for quotation", quotation.id);
    } catch (emailErr) {
      console.error("Email send failed (quotation created):", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Quotation created successfully (PDF generated).",
      data: quotation,
    });
  } catch (err) {
    try {
      if (t && !t.finished) await t.rollback();
    } catch (rbErr) {
      console.warn("Rollback attempt failed:", rbErr.message);
    }

    // Cleanup uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filePath = path.join(__dirname, "..", "uploads", "quotations", file.filename);
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn("Failed to remove uploaded file during cleanup:", filePath, unlinkErr.message);
        }
      }
    }

    console.error("Error creating quotation:", err);
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {}
    }
  }
};

// ---------- Get all quotations ----------
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      include: [{ model: QuotationFile, as: "files" }],
      order: [["id", "DESC"]],
    });
    res.json({ success: true, data: quotations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- Get single quotation ----------
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [{ model: QuotationFile, as: "files" }],
    });
    if (!quotation) return res.status(404).json({ success: false, message: "Quotation not found" });
    res.json({ success: true, data: quotation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- Update status ----------
export const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findByPk(req.params.id);
    if (!quotation) return res.status(404).json({ success: false, message: "Quotation not found" });
    quotation.status = status;
    await quotation.save();
    res.json({ success: true, message: "Quotation status updated", data: quotation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- Delete quotation ----------
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByPk(req.params.id, {
      include: [{ model: QuotationFile, as: "files" }],
    });
    if (!quotation) return res.status(404).json({ success: false, message: "Quotation not found" });

    // Delete files from disk
    if (quotation.files && quotation.files.length > 0) {
      for (const file of quotation.files) {
        const p = path.join(__dirname, "..", file.file_path || "");
        if (fs.existsSync(p)) {
          try {
            fs.unlinkSync(p);
          } catch (e) {
            console.warn("Failed to delete file:", p, e.message);
          }
        }
      }
    }

    await quotation.destroy();
    res.json({ success: true, message: "Quotation deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
