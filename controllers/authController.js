// backend/controllers/authController.js
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Otp, Session } from "../models/index.js";
import { sendOtpEmail } from "../utils/email.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import config from "../config/config.js";

const JWT_SECRET = config.jwt.secret;
const JWT_REFRESH_SECRET = config.jwt.refreshSecret;

// ------------------- GOOGLE LOGIN -------------------
export const googleLogin = (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const redirectUri = config.google.redirectUri;
  console.log("🔗 [Google Auth] Starting login. Redirect URI:", redirectUri);

  const options = {
    redirect_uri: redirectUri,
    client_id: config.google.clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${qs}`);
};

// ------------------- GOOGLE CALLBACK -------------------
// ------------------- GOOGLE CALLBACK -------------------
export const googleCallback = async (req, res) => {
  const code = req.query.code;
  const redirectUri = config.google.redirectUri;
  try {
    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = data;
    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );

    const { email, name, picture } = googleUser.data;
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        provider: "google",
        verified: true,
      });
    }

    const token = generateAccessToken(user);
    const refreshToken = await issueRefreshToken(user, req.headers["user-agent"], req.ip);

    // ✅ Redirect with token in URL for frontend to read
    res.redirect(`${config.frontendUrl}/shop?token=${token}`);
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed" });
  }
};


// ------------------- GET ME -------------------
export const getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider || "local",
      verified: user.verified,
      role: user.role || "user",
    },
  });
};

// ------------------- LOGOUT -------------------
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

// ------------------- REGISTER -------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role = "user" } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim())
      return res.status(400).json({ message: "Name, email and password are required" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      password: hashedPassword,
      role,
    });

    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.create({
      userId: user.id,
      email: user.email,
      otp: generatedOtp,
      expiresAt,
    });

    await sendOtpEmail(user.email, generatedOtp);

    res.status(201).json({
      message: "OTP sent to your email. Please verify to activate account.",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Register user error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// ------------------- VERIFY OTP -------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const found = await Otp.findOne({ where: { email, otp } });
    if (!found) return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.verified = true;
    await user.save();

    // generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await issueRefreshToken(user, req.headers["user-agent"], req.ip);

    // set httpOnly cookie for 'token'
    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      message: "OTP verified",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        verified: true,
        provider: user.provider || "local",
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ------------------- RESEND OTP -------------------
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const existingOtp = await Otp.findOne({ where: { userId: user.id, purpose: "register" } });
    if (existingOtp) {
      existingOtp.otp = newOtp;
      existingOtp.expiresAt = expiresAt;
      existingOtp.createdAt = new Date();
      await existingOtp.save();
    } else {
      await Otp.create({
        userId: user.id,
        email,
        otp: newOtp,
        purpose: "register",
        expiresAt,
      });
    }

    await sendOtpEmail(email, newOtp);
    res.status(200).json({ message: "OTP resent to your email", otpSent: true });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// ------------------- LOGIN -------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: "Invalid password" });
    } else {
      return res.status(400).json({ message: "Password login not available for this user" });
    }

    if (!user.verified) return res.status(403).json({ message: "User not verified" });

    const accessToken = generateAccessToken(user);
    const refreshToken = await issueRefreshToken(user, req.headers["user-agent"], req.ip);

    // set httpOnly cookie for 'token' so protect middleware will find it
    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        verified: user.verified,
        provider: user.provider || "local",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// ------------------- FORGOT PASSWORD -------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({ userId: user.id, email, otp, expiresAt: expires, purpose: "reset" });
    await sendOtpEmail(email, otp);

    res.json({ message: "Password reset OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ------------------- RESET PASSWORD -------------------
export const resetPassword = async (req, res) => {
  try {
    console.log("🔥 RESET PASSWORD CONTROLLER HIT");

    const { email, otp, newPassword } = req.body;
    console.log("📥 Incoming data:", { email, otp, newPassword });

    const user = await User.findOne({ where: { email } });
    console.log("👤 User found:", !!user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const userOtp = await Otp.findOne({
      where: { email, userId: user.id, purpose: "reset" },
      order: [["createdAt", "DESC"]],
    });

    console.log("🔐 OTP record found:", !!userOtp);

    if (!userOtp) {
      console.log("❌ OTP not found");
      return res.status(400).json({ message: "OTP not found" });
    }

    console.log("🔢 OTP match:", userOtp.otp === otp);
    console.log("⏰ OTP expired:", new Date() > userOtp.expiresAt);

    if (userOtp.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (new Date() > userOtp.expiresAt)
      return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔑 Password hashed");

    await user.update({ password: hashedPassword });
    console.log("✅ User password updated");

    await userOtp.update({ verified: true });
    console.log("✅ OTP marked verified");

    console.log("🚀 Sending response to frontend");

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("🔥 RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Reset password failed" });
  }
};

// ------------------- REFRESH ACCESS TOKEN -------------------
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    const session = await Session.findOne({ where: { refresh_token: refreshToken, valid: true } });
    if (!session) return res.status(401).json({ message: "Invalid refresh token" });

    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const accessToken = generateAccessToken(user);

    // set cookie for new access token
    res.cookie("token", accessToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh access token error:", err);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// ------------------- ISSUE REFRESH TOKEN -------------------
export const issueRefreshToken = async (user, device = "Unknown", ip = null) => {
  const token = generateRefreshToken(user);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await Session.create({
    user_id: user.id,
    refresh_token: token,
    device,
    ip_address: ip,
    expires_at: expiresAt,
    valid: true,
  });

  return token;
};
