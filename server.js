// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./models/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// ----------------- CONFIG SETUP ----------------- //
import config from "./config/config.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------- ROUTES ----------------- //
import userRoutes from "./routes/userRoutes.js";
import userAddressRoutes from "./routes/userAddressRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productImageRoutes from "./routes/productImageRoutes.js";
import productKeyFeatureRoutes from "./routes/productKeyFeatureRoutes.js";
import productVariantRoutes from "./routes/productVariantRoutes.js";
import productReviewRoutes from "./routes/productReviewRoutes.js";
import cartItemRoutes from "./routes/cartItemRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderItemRoutes from "./routes/orderItemRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import supportTicketRoutes from "./routes/supportTicketRoutes.js";
import productdetailRoutes from "./routes/productDetailRoutes.js";
import subcategoryRoutes from "./routes/subcategoryRoutes.js";
import subcategoryItemRoutes from "./routes/subcategoryItemRoutes.js";
import categoryMenuRoutes from "./routes/categoryMenuroutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import adminRoutes from "./routes/adminroutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import promoCodeRoutes from "./routes/promoCodeRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import cvRoutes from "./routes/cvRoutes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import invoiceRequestRoutes from "./routes/invoiceRequestRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";


// Webhook controller
import { tapWebhook } from "./controllers/webhookController.js";

// ----------------- PASSPORT ----------------- //
import "./config/passport.js";

// ----------------- FIREBASE ADMIN ----------------- //
import "./config/firebase-admin.js";

// ----------------- APP INIT ----------------- //
const app = express();

// ----------------- MIDDLEWARE ----------------- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.frontendUrl.replace(/\/$/, ''), // Remove trailing slash
    credentials: true,
  })
);

app.use(passport.initialize());

// ----------------- DB CONNECT ----------------- //
connectDB();

// ----------------- WEBHOOK ROUTE (Tap) ----------------- //
// Use express.raw only for this POST route
app.post("/webhooks/tap", express.raw({ type: "application/json" }), tapWebhook);

// ----------------- ROUTES SETUP ----------------- //
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/user-addresses", userAddressRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/product-images", productImageRoutes);
app.use("/api/v1/product-features", productKeyFeatureRoutes);
app.use("/api/v1/product-variants", productVariantRoutes);
app.use("/api/v1/product-reviews", productReviewRoutes);
app.use("/api/v1/cart-items", cartItemRoutes);
app.use("/api/v1/wishlists", wishlistRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/order-items", orderItemRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/shipments", shipmentRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use("/api/v1/support-tickets", supportTicketRoutes);
app.use("/api/v1/product-details", productdetailRoutes);
app.use("/api/v1/subcategories", subcategoryRoutes);
app.use("/api/v1/subcategory-items", subcategoryItemRoutes);
app.use("/api/v1/menu", categoryMenuRoutes);
app.use("/api/v1/banners", bannerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/quotations", quotationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/promo-codes", promoCodeRoutes);
app.use("/api/v1/cv", cvRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/invoice-request", invoiceRequestRoutes);
app.use("/api/v1/jobs", jobRoutes);


// ----------------- STATIC FILES ----------------- //
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ----------------- TEST ROUTE ----------------- //
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// ----------------- SWAGGER SETUP ----------------- //
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🛍️ Maaj E-commerce API",
      version: "1.0.0",
      description: "Full API documentation for the Maaj E-commerce backend",
      contact: { name: "API Support", email: "support@maaj.com" },
    },
    servers: [
      { url: config.backendUrl, description: "Current Server" },
      { url: "http://localhost:5000", description: "Development Server" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "./routes/*.js"), path.join(__dirname, "./routes/**/*.js")],
};

let swaggerSpec;
try {
  swaggerSpec = swaggerJsdoc(swaggerOptions);
} catch (err) {
  console.error("❌ Swagger generation failed:", err.message);
  swaggerSpec = { openapi: "3.0.0", info: { title: "Fallback Docs", version: "0.0.0" }, paths: {} };
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Maaj E-commerce API Docs",
  swaggerOptions: { persistAuthorization: true, displayRequestDuration: true },
}));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ----------------- ERROR HANDLER ----------------- //
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: config.env !== "production" ? err.stack : undefined,
  });
});

// ----------------- START SERVER ----------------- //
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${config.env} mode on port ${PORT}`);
  console.log(`📘 Swagger Docs: ${config.backendUrl}/api-docs`);
});
