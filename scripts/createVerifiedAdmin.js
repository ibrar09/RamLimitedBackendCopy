// scripts/createVerifiedAdmin.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, sequelize } from "../models/index.js"; // adjust path if needed

// ✅ Change these to your desired admin credentials
const ADMIN_EMAIL = "adminverified@example.com";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_NAME = "Admin";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");

    // Check if admin already exists
    let user = await User.findOne({ where: { email: ADMIN_EMAIL } });

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (!user) {
      // Create new admin
      user = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        phone: "0000000000",
        role: "admin",
        verified: true,       // ✅ verified
        provider: "local",
      });
      console.log("🟢 Created new verified admin:", ADMIN_EMAIL);
    } else {
      // Promote existing user to admin and reset password
      user.role = "admin";
      user.password = hashedPassword;
      user.verified = true;   // ✅ mark as verified
      await user.save();
      console.log("🟡 Updated existing user to verified admin:", ADMIN_EMAIL);
    }

    // Optional: generate JWT for testing
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("\n=== ADMIN CREDENTIALS ===");
    console.log("Email:   ", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASSWORD);
    console.log("JWT:     ", token);
    console.log("=========================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

run();
