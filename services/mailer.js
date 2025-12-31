import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ------------------ SMTP TRANSPORTER ------------------ //
export const transporter = nodemailer.createTransport({
  service: "gmail", // using Gmail
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // your Gmail app password
  },
});

// ------------------ COMMON MAIL OPTIONS ------------------ //
export const mailOptionsBase = {
  from: process.env.EMAIL_USER, // sender address
};

// ------------------ SEND EMAIL FUNCTION ------------------ //
export const sendMail = async ({ to, subject, text, html, attachments }) => {
  try {
    const mailOptions = {
      ...mailOptionsBase,
      to,
      subject,
      text,
      html,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending error: ", error);
    throw error;
  }
};
