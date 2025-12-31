import { Payment, Order, User ,OrderItem ,Product } from "../models/index.js";
import axios from "axios";
/**
 * Create a new payment
 * @param {Object} data - Payment data
 * @returns {Promise<Payment>}
 */
export const createPayment = async (data) => {
  return await Payment.create(data);
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (id) => {
  return await Payment.findByPk(id, {
    include: [
      {
        model: Order,
        as: 'order', // Added alias
        attributes: ["id", "user_id", "status", "created_at", "order_number", "total"],
      },
    ],
  });
};

/**
 * Get all payments (Admin only)
 */
export const getAllPayments = async () => {
  return await Payment.findAll({
    include: [
      {
        model: Order,
        as: 'order', // Added alias
        attributes: ["id", "user_id", "status", "created_at", "order_number", "total"],
        include: [
          {
            model: User,
            as: 'user', // Added alias if you have user association
            attributes: ["id", "name", "email"]
          }
        ]
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

/**
 * Get payments for a specific user
 */
// export const getPaymentsByUser = async (user_id) => {
//   return await Payment.findAll({
//     include: [
//       {
//         model: Order,
//         as: 'order', // Added alias
//         where: { user_id },
//         attributes: ["id", "status", "created_at", "order_number", "total"],
//         include: [
//           {
//             model: User,
//             as: 'user', // Added alias if you have user association
//             attributes: ["id", "name", "email"]
//           }
//         ]
//       },
//     ],
//     order: [["created_at", "DESC"]],
//   });
// };

/**
 * Get payments by order
 */
export const getPaymentsByOrderNumber = async (orderNumber) => {
  console.log("🔹 [paymentService] Fetching payments for orderNumber:", orderNumber);

  // Find the order first
  const order = await Order.findOne({
    where: { order_number: orderNumber },
    attributes: ["id", "user_id", "status", "createdAt", "order_number", "total"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!order) {
    console.warn("⚠️ [paymentService] Order not found for orderNumber:", orderNumber);
    return [];
  }

  console.log("✅ [paymentService] Order found:", order.id);

  // Find all payments for this order
  const payments = await Payment.findAll({
    where: { order_id: order.id },
    include: [
      {
        model: Order,
        as: "order",
        attributes: ["id", "user_id", "status", "createdAt", "order_number", "total"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  console.log(`🔹 [paymentService] Payments found: ${payments.length}`);
  return payments;
};

/**
 * Update payment
 */
export const updatePayment = async (id, data) => {
  const payment = await Payment.findByPk(id);
  if (!payment) throw new Error("Payment not found");
  return await payment.update(data);
};

/**
 * Delete payment
 */
export const deletePayment = async (id) => {
  const payment = await Payment.findByPk(id);
  if (!payment) throw new Error("Payment not found");
  return await payment.destroy();
};
export const getPaymentsByUser = async (userId) => {
  try {
    console.log('[paymentService] userId:', userId, 'type:', typeof userId);

    // Fetch payments for user with associated order
    const payments = await Payment.findAll({
      where: { userId }, // matches the Payment.userId column
      include: [
        {
          model: Order,
          as: "order", // matches Payment.belongsTo(Order, { as: "order" })
          attributes: ["id", "order_number"], // select only needed fields
        },
      ],
      order: [["transaction_date", "DESC"]],
    });

    console.log('[paymentService] payments fetched:', payments.length);
    return payments;
  } catch (error) {
    console.error('❌ [paymentService] Error fetching payments:', error);
    throw error;
  }
};
export const updatePaymentStatusByChargeId = async (chargeId, newStatus) => {
  const payment = await Payment.findOne({
    where: { charge_id: chargeId }
  });

  if (!payment) {
    console.log("⚠️ No payment found for charge:", chargeId);
    return null;
  }

  payment.status = newStatus;
  payment.updated_at = new Date();
  await payment.save();

  console.log(`✅ Payment ${payment.id} updated → ${newStatus}`);

  return payment;
};





