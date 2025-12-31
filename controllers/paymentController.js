import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import * as paymentService from "../services/paymentService.js";


/**
 * Create payment (Admin only)
 */
export const createPayment = async (req, res) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment
    });
  } catch (err) {
    console.error("❌ Create Payment Error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

/**
 * Get payment by ID (Admin only)
 */
export const getPaymentById = async (req, res) => { // Changed from getPayment to getPaymentById
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        error: "Payment not found" 
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (err) {
    console.error("❌ Get Payment by ID Error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

/**
 * Get all payments (Admin only)
 */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    console.error("❌ Get All Payments Error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

/**
 * Get payments for logged-in user
 */
export const getPaymentsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await paymentService.getPaymentsByUser(userId);
    
    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    console.error("❌ Get User Payments Error:", err);
    res.status(500).json({ 
      success: false,
      error: "Failed to load payment history" 
    });
  }
};

/**
 * Get payments by order
 */
export const getPaymentsByOrder = async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const payments = await paymentService.getPaymentsByOrder(orderId);

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments found for this order"
      });
    }

    // Check if user owns the order (using the alias 'order' instead of 'Order')
    const userOwnsPayment = payments.every(
      (payment) => payment.order?.user_id === req.user.id
    );
    
    if (req.user.role !== "admin" && !userOwnsPayment) {
      return res.status(403).json({ 
        success: false,
        message: "Access denied to these payments" 
      });
    }

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    console.error("❌ Get Payments by Order Error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

/**
 * Update payment (Admin only)
 */
export const updatePayment = async (req, res) => {
  try {
    const payment = await paymentService.updatePayment(req.params.id, req.body);
    
    res.json({
      success: true,
      message: "Payment updated successfully",
      data: payment
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Delete payment (Admin only)
 */
export const deletePayment = async (req, res) => {
  try {
    await paymentService.deletePayment(req.params.id);
    
    res.json({ 
      success: true,
      message: "Payment deleted successfully" 
    });
  } catch (err) {
    console.error("❌ Delete Payment Error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const getDashboardPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('[paymentController] req.user:', req.user);
    console.log('[paymentController] userId before service call:', userId, 'type:', typeof userId);

    const payments = await getPaymentsByUser(userId);

    // Format payments for frontend
    const formatted = payments.map((p) => ({
      payment_id: p.id,
      order_number: p.order?.order_number || "-",
      amount: p.amount,
      status: p.status,
      payment_method: p.payment_method,
      transaction_date: p.transaction_date,
    }));

    res.status(200).json({ success: true, payments: formatted });
  } catch (error) {
    console.error('❌ [paymentController] Error:', error);
    res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
};
export const confirmPayment = async (req, res) => {
  const { tapChargeId } = req.params;

  try {
    console.log("🔹 [ConfirmPayment] Fetching payment status for:", tapChargeId);

    // 1️⃣ Get latest status from Tap
    const tapResponse = await tapService.getPaymentStatus(tapChargeId);
    console.log("🟢 [ConfirmPayment] Tap response:", tapResponse);

    const status = tapResponse.status.toLowerCase(); // e.g., 'captured', 'declined'

    // 2️⃣ Update payment
    const payment = await Payment.findOne({ where: { payment_reference: tapChargeId } });
    if (!payment) {
      console.error("❌ [ConfirmPayment] Payment not found for reference:", tapChargeId);
      return res.status(404).json({ message: "Payment not found" });
    }
    payment.status = status;
    payment.gateway_response = JSON.stringify(tapResponse);
    await payment.save();
    console.log("✅ [ConfirmPayment] Payment updated:", payment.id, "Status:", status);

    // 3️⃣ Update order
    const order = await Order.findByPk(payment.order_id);
    if (!order) {
      console.error("❌ [ConfirmPayment] Order not found for order_id:", payment.order_id);
      return res.status(404).json({ message: "Order not found" });
    }
    order.payment_status = status;
    if (status === "captured") order.status = "paid";
    await order.save();
    console.log("✅ [ConfirmPayment] Order updated:", order.id, "Status:", order.status);

    // 4️⃣ Update stock
    const orderItems = await OrderItem.findAll({ where: { order_id: order.id } });
    for (const item of orderItems) {
      const product = await Product.findByPk(item.product_id);
      if (!product) {
        console.error("❌ [ConfirmPayment] Product not found for product_id:", item.product_id);
        continue;
      }
      console.log(
        "🔹 [ConfirmPayment] Updating stock for product:",
        product.id,
        "Current stock:", product.stock,
        "Ordered quantity:", item.quantity
      );

      product.stock = product.stock - item.quantity;
      if (product.stock < 0) product.stock = 0;
      await product.save();

      console.log("✅ [ConfirmPayment] Stock updated for product:", product.id, "New stock:", product.stock);
    }

    console.log("✅ [ConfirmPayment] Payment, order, and stock updated successfully for order:", order.id);
    res.json({ message: "Payment confirmed", order, payment });

  } catch (err) {
    console.error("❌ [ConfirmPayment] Unexpected error:", err);
    res.status(500).json({ message: "Error confirming payment" });
  }
};



// export const confirmPayment = async (req, res) => {
//   const { tapChargeId } = req.params;

//   try {
//     // 1️⃣ Fetch latest payment status from Tap
//     const tapResponse = await tapService.getPaymentStatus(tapChargeId);
//     const status = tapResponse.status.toLowerCase(); // e.g., 'captured', 'declined'

//     // 2️⃣ Update Payment table
//     const payment = await Payment.findOne({ where: { payment_reference: tapChargeId } });
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     payment.status = status;
//     payment.gateway_response = JSON.stringify(tapResponse); // store full response safely
//     await payment.save();

//     // 3️⃣ Update Order table
//     const order = await Order.findByPk(payment.order_id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.payment_status = status;
//     if (status === "captured") order.status = "paid";
//     await order.save();

//     return res.json({ message: "Payment confirmed", order, payment });
//   } catch (err) {
//     console.error("❌ [confirmPayment] Error:", err);
//     return res.status(500).json({ message: "Error confirming payment" });
//   }
// };


export const getPaymentsByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.query;
    console.log("🔹 [paymentController] orderNumber query:", orderNumber);

    if (!orderNumber) {
      console.error("❌ [paymentController] Missing orderNumber");
      return res.status(400).json({
        success: false,
        error: "orderNumber query parameter is required",
      });
    }

    const payments = await paymentService.getPaymentsByOrderNumber(orderNumber);
    console.log("🔹 [paymentController] Payments received:", payments);

    if (!payments || payments.length === 0) {
      console.log("⚠️ [paymentController] No payments found");
      return res.json({
        success: true,
        count: 0,
        data: [],
        message: "No payment history found for this order number",
      });
    }

    const formatted = payments.map((p) => ({
      payment_id: p.id,
      order_id: p.order?.id || "-",
      order_number: p.order?.order_number || "-",
      amount: p.amount,
      currency: p.currency || "SAR",
      method: p.method,
      status: p.status,
      date: p.createdAt
        ? new Date(p.createdAt).toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
        : "-",
      order_status: p.order?.status || "-",
      user_name: p.order?.user?.name || "-",
      user_email: p.order?.user?.email || "-",
    }));

    console.log("🔹 [paymentController] Formatted payments:", formatted);

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });

  } catch (err) {
    console.error("❌ [getPaymentsByOrderNumber] Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to load payment history",
    });
  }
};


export const getPaymentsByUserController = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log("[paymentController] req.user:", req.user);
    console.log("[paymentController] userId before service call:", userId, "type:", typeof userId);

    if (!userId) {
      return res.status(400).json({ success: false, error: "Invalid user" });
    }

    const payments = await paymentService.getPaymentsByUser(userId);

    if (!payments || payments.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: [],
        message: "No payment history found"
      });
    }

    const formatted = payments.map((p) => ({
      payment_id: p.id,
      order_id: p.order?.id || "-",
      order_number: p.order?.order_number || "-",
      amount: p.amount,
      method: p.payment_method || "-",
      status: p.status || "-",
      date: p.createdAt
        ? new Date(p.createdAt).toLocaleString("en-US", { timeZone: "Asia/Riyadh" })
        : "-",
      order_status: p.order?.status || "-",
    }));

    console.log("[paymentController] Payments formatted:", formatted.length);
    res.json({ success: true, count: formatted.length, data: formatted });

  } catch (err) {
    console.error("❌ [paymentController] Error:", err);
    res.status(500).json({ success: false, error: "Failed to load payment history" });
  }
};

export const tapWebhook = async (req, res) => {
  const t = await sequelize.transaction(); // start transaction
  try {
    const payload = req.body;
    console.log("🟢 [Webhook] Payload received:", payload);

    const order = await Order.findOne({
      where: { tap_charge_id: payload.id },
      include: [{ model: OrderItem, as: "items" }],
      transaction: t
    });

    if (!order) return res.status(404).send("Order not found");

    const payment = await Payment.findOne({
      where: { payment_reference: payload.id },
      transaction: t
    });
    if (!payment) return res.status(404).send("Payment not found");

    // Update payment
    payment.status = payload.status.toLowerCase();
    payment.gateway_response = JSON.stringify(payload);
    await payment.save({ transaction: t });

    // Update order
    order.payment_status = payload.status.toLowerCase();
    if (payload.status.toLowerCase() === "captured") {
      order.status = "completed";

      // Deduct stock for each item
      for (const item of order.items) {
        await Product.decrement(
          { stock: item.quantity },
          { where: { id: item.product_id }, transaction: t }
        );
        console.log(`✅ Stock decremented for product ${item.product_id} by ${item.quantity}`);
      }
    }

    await order.save({ transaction: t });
    await t.commit();
    console.log("✅ Webhook processed successfully");
    return res.sendStatus(200);

  } catch (err) {
    await t.rollback();
    console.error("❌ [Webhook] Error:", err);
    return res.status(500).send("Webhook error");
  }
};




// export const tapWebhook = async (req, res) => {
//     console.log("🟢 [Webhook] Request received:", req.headers, req.body);
//   const payload = req.body;
//   console.log("🟢 [Webhook] Payload received:", payload);

//   const order = await Order.findOne({ where: { tap_charge_id: payload.id } });
//   if (!order) return res.status(404).send("Order not found");

//   const payment = await Payment.findOne({ where: { payment_reference: payload.id } });
//   if (!payment) return res.status(404).send("Payment not found");

//   payment.status = payload.status.toLowerCase(); // e.g., 'captured'
//   await payment.save();

//   order.payment_status = payload.status.toLowerCase();
//   await order.save();

//   console.log("✅ [Webhook] Payment and order updated:", payment.id, order.id);
//   res.sendStatus(200);
// };



const decreaseStock = async (orderId) => {
  const items = await OrderItem.findAll({ where: { order_id: orderId } });

  for (const item of items) {
    const product = await Product.findByPk(item.product_id);
    if (product) {
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        console.log(`✅ Stock updated for product ${product.id}: ${product.stock}`);
      } else {
        console.warn(`⚠️ Not enough stock for product ${product.id}`);
        // Optional: throw error or mark as backorder
      }
    }
  }
};