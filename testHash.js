// backend/captureTest.js
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { Sequelize } from "sequelize";
import OrderModel from "./models/Order.js";

// -------------------- DATABASE --------------------
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: console.log,
  }
);

const Order = OrderModel(sequelize);

// -------------------- TEST FUNCTION --------------------
const capturePayment = async () => {
  try {
    const orderId = 97;
    const tapPaymentId = "chg_TS02A2420250550Rq9j2011707";

    // Fetch order from DB
    const order = await Order.findByPk(orderId);
    if (!order) {
      console.error("❌ Order not found");
      return;
    }
    console.log("🟢 Order fetched:", order.order_number);

    if (!order.tap_payment_response) {
      console.error("❌ tap_payment_response missing in order");
      return;
    }
    console.log("🟢 tap_payment_response exists");

    // Make request to Tap capture API
    console.log("🔹 Capturing charge:", tapPaymentId);
    const response = await axios.post(
      `https://api.tap.company/v2/charges/${tapPaymentId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🟢 Capture response:", response.data);

    // Update order status if successful
    if (response.data.status === "CAPTURED" || response.data.response?.code === "000") {
      order.payment_status = "paid";
      await order.save();
      console.log(`✅ Payment captured and order ${order.order_number} updated`);
    } else {
      console.warn("⚠ Capture not successful, status:", response.data.status);
    }
  } catch (err) {
    console.error("❌ Error capturing payment:", err.response?.data || err.message);
  } finally {
    await sequelize.close();
  }
};

capturePayment();
