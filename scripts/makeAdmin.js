// scripts/makeAdmin.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, sequelize } from "../models/index.js"; // adjust path if needed

const ADMIN_EMAIL = "admintest2@example.com"; // admin email
const ADMIN_PASSWORD = "Admin123!";          // admin password
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const run = async () => {
  await sequelize.authenticate();

  let user = await User.findOne({ where: { email: ADMIN_EMAIL } });

  if (!user) {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    user = await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashed,
      phone: "0000000000",
      role: "admin",
      verified: true,   // ✅ mark as verified
      otp: "332324" // ✅ mark OTP verified (if your DB has this column)
    });
    console.log("Created new OTP-verified admin:", ADMIN_EMAIL);
  } else {
    // Promote existing user to admin, reset password, mark verified & OTP verified
    user.role = "admin";
    user.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
    user.verified = true;
    user.otpVerified = true; // ✅ mark OTP verified
    await user.save();
    console.log("Updated existing user to OTP-verified admin:", ADMIN_EMAIL);
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("\n=== ADMIN CREDENTIALS ===");
  console.log("Email:   ", ADMIN_EMAIL);
  console.log("Password:", ADMIN_PASSWORD);
  console.log("JWT:     ", token);
  console.log("=========================\n");

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
