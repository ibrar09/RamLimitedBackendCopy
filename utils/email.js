// backend/utils/email.js
import nodemailer from "nodemailer";
import config from "../config/config.js";
import path from "path";
import { fileURLToPath } from "url";

/**
 * 🔹 Resolve __dirname (ES module safe)
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 🔹 Create reusable transporter (USED BY BOTH EMAILS)
 */
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

/**
 * 🔹 Send OTP Email (UNCHANGED LOGIC)
 */
export const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"SA Online Store" <${config.email.user}>`,
      to: email,
      subject: "🔐 Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your Verification Code</h2>
          <p>Your OTP code is:</p>
          <h1 style="background: #f3f3f3; display: inline-block; padding: 10px 20px; border-radius: 8px;">
            ${otp}
          </h1>
          <p>This code will expire in <b>5 minutes</b>.</p>
          <br />
          <small>If you did not request this, please ignore this email.</small>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`📧 Sending OTP ${otp} to ${email}`);
    return true;
  } catch (err) {
    console.error("❌ Failed to send OTP email:", err);
    return false;
  }
};

/**
 * 🔹 Send Invoice PDF Email (FIXED)
 */
export const sendInvoiceEmail = async (toEmail, pdfPath) => {
  try {
    if (!toEmail || !pdfPath) {
      throw new Error("Email or PDF path missing");
    }

    // 🔥 FIX: stable absolute path
    const absolutePdfPath = path.join(__dirname, "..", pdfPath);

    const info = await transporter.sendMail({
      from: `"Your Company" <${config.email.user}>`,
      to: toEmail,
      subject: "Your Invoice PDF",
      text: "Please find your invoice attached.",
      html: `<p>Hello,</p><p>Please find your invoice attached.</p><p>Thank you!</p>`,
      attachments: [
        {
          filename: path.basename(pdfPath),
          path: absolutePdfPath,
        },
      ],
    });

    console.log(`[Email] Invoice sent to ${toEmail}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("[Email] sendInvoiceEmail Error:", err);
    throw err;
  }
};


export const sendMail = async ({ to, subject, html, text = "No text provided" }) => {
  try {
    if (!to) throw new Error("Recipient email (`to`) is not defined");

    console.log("[Email] Sending mail...");
    console.log({ to, subject });

    const info = await transporter.sendMail({
      from: `"Your Company" <${config.email.user}>`,
      to,
      subject,
      html,
      text,
    });

    console.log(`[Email] Mail sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("[Email] sendMail Error:", err);
    throw err;
  }
};
