// import { Order, Payment } from "../models/index.js";
// import axios from "axios";

// export const tapWebhookController = async (req, res) => {
//   try {
//     const event = req.body;
//     console.log("📩 TAP Webhook Received:", event);

//     const tapId = event.id;
//     const status = event.status;
//     const orderId = event.reference?.order;

//     if (!tapId || !orderId) {
//       return res.status(400).json({ message: "Invalid webhook payload" });
//     }

//     // Update payment table
//     await Payment.update(
//       { tap_status: status },
//       { where: { tap_id: tapId } }
//     );

//     // Update order status
//     if (status === "CAPTURED") {
//       await Order.update(
//         { status: "paid" },
//         { where: { id: orderId } }
//       );
//     } else if (status === "FAILED" || status === "CANCELED") {
//       await Order.update(
//         { status: "failed" },
//         { where: { id: orderId } }
//       );
//     }

//     console.log("✅ Webhook processed successfully");

//     return res.status(200).json({ received: true });
//   } catch (error) {
//     console.error("❌ Webhook Error:", error);
//     return res.status(500).json({ error: "Webhook processing failed" });
//   }
// };
