// services/tapService.js
import axios from "axios";
import config from "../config/config.js";

const TAP_BASE_URL = "https://api.tap.company/v2";
const TAP_SECRET_KEY = config.tap.secretKey;

const headers = {
  Authorization: `Bearer ${TAP_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const TapService = {
  /**
   * Create a new payment/charge
   */
  createPayment: async ({ amount, currency, customer, description, order_id, source_id, method = "CREATE" }) => {
    const data = {
      amount,
      currency,
      threeDSecure: true,
      save_card: false,
      description,
      statement_descriptor: "MAAJ Store",
      metadata: { order_id },
      customer,
      source: { id: source_id || "src_all" },
      redirect: { url: `${config.frontendUrl}/payment-callback` },
      method, // "CREATE" or "AUTHORIZE"
    };

    console.log("🔹 [TapService] Creating payment with data:", data);

    const response = await axios.post(`${TAP_BASE_URL}/charges`, data, { headers });
    console.log("🟢 [TapService] Payment response:", response.data);
    return response.data;
  },

  /**
   * Capture a payment (for AUTHORIZE method)
   */
  capturePayment: async (chargeId) => {
    console.log(`🔹 [TapService] Capturing charge: ${chargeId}`);
    const response = await axios.post(`${TAP_BASE_URL}/charges/${chargeId}/capture`, {}, { headers });
    console.log("🟢 [TapService] Capture response:", response.data);
    return response.data;
  },

  /**
   * Retrieve the status of a payment
   */
  getPaymentStatus: async (chargeId) => {
    console.log(`🔹 [TapService] Retrieving status for charge: ${chargeId}`);
    try {
      const response = await axios.get(`${TAP_BASE_URL}/charges/${chargeId}`, { headers });
      console.log("🟢 [TapService] Payment status response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [TapService] Error fetching charge status:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Refund a payment
   * @param {string} chargeId - Tap charge ID
   * @param {number} [amount] - Amount to refund (optional, full refund if not provided)
   */
  refundPayment: async (chargeId, amount = null) => {
    console.log(`🔹 [TapService] Refunding charge: ${chargeId}, amount: ${amount}`);
    try {
      const payload = amount ? { amount: Math.round(amount * 100) } : {};
      const response = await axios.post(`${TAP_BASE_URL}/charges/${chargeId}/refund`, payload, { headers });
      console.log("🟢 [TapService] Refund response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [TapService] Error during refund:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default TapService;
