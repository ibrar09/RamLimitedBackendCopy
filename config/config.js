import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,

  // Database Configuration
  db: {
    url: process.env.DATABASE_URL || null,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "webdb",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || "maaj_super_secret_token_12345",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "maaj_super_refresh_token_12345",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  },

  // Payment Gateway (Tap)
  tap: {
    secretKey: process.env.TAP_SECRET_KEY,
    publicKey: process.env.TAP_PUBLIC_KEY,
    environment: process.env.TAP_ENVIRONMENT || "sandbox",
    callbackUrl: process.env.TAP_CALLBACK_URL || "http://localhost:3000/payment-callback",
  },

  // Auth Configuration
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/api/v1/auth/google/callback",
  },

  // URLs
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  backendUrl: process.env.BACKEND_URL || "http://localhost:5000",

  // Email Configuration
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    receiver: process.env.CONTACT_RECEIVER_EMAIL,
  },

  // Uploads
  uploadsPath: process.env.UPLOADS_PATH || "uploads",
};

// Simple validation
const requiredVars = [
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "JWT_SECRET",
];

requiredVars.forEach((varName) => {
  if (!process.env[varName] && config.env === "production") {
    console.warn(`[WARNING]: Environment variable ${varName} is missing in production!`);
  }
});

export default config;
