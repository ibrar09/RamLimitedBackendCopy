import { CV } from "../models/index.js"; // ✅ CV model
import path from "path";
import fs from "fs";
import { transporter, mailOptionsBase } from "../services/mailer.js"; // your existing email setup

// ---------------- CREATE CV ---------------- //
export const createCV = async (req, res) => {
  try {
    const { name, email, phone, experience, position, message } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const resumePath = req.file.path;

    // Save CV to database
    const newCV = await CV.create({
      name,
      email,
      phone,
      experience,
      position,
      message,
      resume: resumePath,
    });

    // ---------------- SEND EMAIL ---------------- //
    const absolutePath = path.resolve(resumePath); // ensure full path
    const mailOptions = {
      ...mailOptionsBase,
      to: process.env.CV_RECEIVER_EMAIL || process.env.EMAIL_USER, // fallback to admin email
      subject: `New CV Submission: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nExperience: ${experience}\nPosition: ${position}\nMessage: ${message || "N/A"}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Experience:</strong> ${experience}</p>
             <p><strong>Position:</strong> ${position}</p>
             <p><strong>Message:</strong> ${message || "N/A"}</p>`,
      attachments: [
        {
          filename: path.basename(resumePath),
          path: absolutePath,
        },
      ],
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("❌ CV email failed:", err);
      else console.log("✅ CV sent via email:", info.response);
    });

    return res.status(201).json({ message: "CV submitted successfully", data: newCV });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- GET ALL CVs ---------------- //
export const getAllCVs = async (req, res) => {
  try {
    const cvs = await CV.findAll();
    return res.status(200).json(cvs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- GET CV BY ID ---------------- //
export const getCVById = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await CV.findByPk(id);

    if (!cv) return res.status(404).json({ error: "CV not found" });

    return res.status(200).json(cv);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- UPDATE CV ---------------- //
export const updateCV = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await CV.findByPk(id);

    if (!cv) return res.status(404).json({ error: "CV not found" });

    const { name, email, phone, experience, position, message } = req.body;

    // Update resume if a new file is uploaded
    if (req.file) {
      if (cv.resume && fs.existsSync(cv.resume)) fs.unlinkSync(cv.resume);
      cv.resume = req.file.path;
    }

    cv.name = name || cv.name;
    cv.email = email || cv.email;
    cv.phone = phone || cv.phone;
    cv.experience = experience || cv.experience;
    cv.position = position || cv.position;
    cv.message = message || cv.message;

    await cv.save();

    return res.status(200).json({ message: "CV updated successfully", data: cv });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------------- DELETE CV ---------------- //
export const deleteCV = async (req, res) => {
  try {
    const { id } = req.params;
    const cv = await CV.findByPk(id);

    if (!cv) return res.status(404).json({ error: "CV not found" });

    // Delete CV file from server
    if (cv.resume && fs.existsSync(cv.resume)) fs.unlinkSync(cv.resume);

    await cv.destroy();

    return res.status(200).json({ message: "CV deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
