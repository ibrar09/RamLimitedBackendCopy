// backend/controllers/webhookController.js
import { sequelize, Order, Payment, OrderItem, Product } from '../models/index.js';
import { mapTapStatusToApp } from "../utils/paymentStatus.js";

/**
 * Webhook handler for Tap
 * - expects raw JSON body for signature verification
 * - header: 'tap-signature' or 'x-tap-signature'
 */
export const tapWebhook = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const payload = req.body;
    console.log("🟢 [Webhook] Payload received:", JSON.stringify(payload, null, 2));

    // 1️⃣ Find order by tap_charge_id
    const order = await Order.findOne({ where: { tap_charge_id: payload.id }, transaction: t });
    if (!order) {
      console.error(`❌ [Webhook] Order not found for tap_charge_id: ${payload.id}`);
      await t.rollback();
      return res.status(404).send("Order not found");
    }
    console.log(`✅ [Webhook] Order found: ${order.id}`);

    // 2️⃣ Find payment by payment_reference
    const payment = await Payment.findOne({ where: { payment_reference: payload.id }, transaction: t });
    if (!payment) {
      console.error(`❌ [Webhook] Payment not found for payment_reference: ${payload.id}`);
      await t.rollback();
      return res.status(404).send("Payment not found");
    }
    console.log(`✅ [Webhook] Payment found: ${payment.id}`);

    // 3️⃣ Map TAP status → app status safely
    const mappedStatus = mapTapStatusToApp(payload.status); // returns { appStatus: "paid" } or similar
    const paymentStatus = typeof mappedStatus === "string" ? mappedStatus : mappedStatus?.appStatus || payload.status;
    const finalStatus = String(paymentStatus).toLowerCase();

    // 4️⃣ Update payment status
    payment.status = finalStatus;
    payment.gateway_response = JSON.stringify(payload);
    await payment.save({ transaction: t });
    console.log(`✅ [Webhook] Payment status updated: ${payment.status}`);

    // 5️⃣ Update order status
    order.payment_status = finalStatus;
    if (finalStatus === "captured" || finalStatus === "paid") {
      order.status = "paid";
    }
    await order.save({ transaction: t });
    console.log(`✅ [Webhook] Order status updated: ${order.status}`);

    // 6️⃣ Update stock for each order item if payment captured
    if (finalStatus === "captured" || finalStatus === "paid") {
      const orderItems = await OrderItem.findAll({ where: { order_id: order.id }, transaction: t });

      if (!orderItems || orderItems.length === 0) {
        console.warn(`⚠️ [Webhook] No order items found for order: ${order.id}`);
      } else {
        console.log(`🔹 [Webhook] Updating stock for ${orderItems.length} items`);

        for (const item of orderItems) {
          const product = await Product.findByPk(item.product_id, { transaction: t });
          if (!product) {
            console.error(`❌ [Webhook] Product not found for product_id: ${item.product_id}`);
            continue;
          }

          console.log(
            `🔹 [Webhook] Product ${product.id} stock before: ${product.stock}, quantity ordered: ${item.quantity}`
          );

          const oldStock = product.stock;
          product.stock = Math.max(product.stock - item.quantity, 0);
          await product.save({ transaction: t });

          console.log(
            `✅ [Webhook] Product ${product.id} stock updated: ${oldStock} → ${product.stock}`
          );
        }
      }
    } else {
      console.log("ℹ️ Payment not captured yet. Stock will not be updated.");
    }

    await t.commit();
    console.log("✅ [Webhook] Payment, order, and stock updated successfully");
    return res.sendStatus(200);
  } catch (err) {
    await t.rollback();
    console.error("❌ [Webhook] Unexpected error:", err);
    return res.status(500).send("Webhook error");
  }
};
