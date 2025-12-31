import { Order, OrderItem, Product, ProductVariant, UserAddress, Payment, User } from "../models/index.js";

export const createOrder = async ({ user_id, address_id, products, payment_method, order_number }) => {
  if (!address_id) throw new Error("Address is required");
  if (!payment_method) throw new Error("Payment method is required");

  const finalOrderNumber = order_number || `ORD-${Date.now()}`;

  const order = await Order.create({
    user_id,
    address_id,
    payment_method,
    order_number: finalOrderNumber,
    status: "pending",
    payment_status: "unpaid"
  });

  let subtotal = 0;

  for (const item of products) {
    const product = await Product.findByPk(item.product_id);
    if (!product) throw new Error(`Product with ID ${item.product_id} not found`);

    const price = product.price || 0;
    const total = price * item.quantity;
    subtotal += total;

    await OrderItem.create({
      order_id: order.id,
      product_id: product.id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      price,
      total,
    });
  }

  const total = subtotal; // you can add tax/shipping if needed
  await order.update({ subtotal, total });

  return order;
};

export const getAllOrders = async () => {
  return await Order.findAll({
    include: [
      { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }, { model: ProductVariant, as: "variant" }] },
      { model: UserAddress, as: "address" },
      { model: Payment, as: "payments" },
      { model: User, as: "user", attributes: ["id", "name", "email"] }
    ],
    order: [["created_at", "DESC"]],
  });
};

export const getOrderById = async (id) => {
  return await Order.findByPk(id, {
    include: [
      { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }, { model: ProductVariant, as: "variant" }] },
      { model: UserAddress, as: "address" },
      { model: Payment, as: "payments" },
      { model: User, as: "user", attributes: ["id", "name", "email"] }
    ],
  });
};

export const updateOrder = async (id, data) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found");
  return await order.update(data);
};

export const deleteOrder = async (id) => {
  const order = await Order.findByPk(id);
  if (!order) throw new Error("Order not found");
  await order.destroy();
  return true;
};

export const getOrdersByUserId = async (userId) => {
  return await Order.findAll({
    where: { user_id: userId },
    include: [
      { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }, { model: ProductVariant, as: "variant" }] },
      { model: UserAddress, as: "address" },
      { model: Payment, as: "payments" },
      { model: User, as: "user", attributes: ["id", "name", "email"] }
    ],
    order: [["created_at", "DESC"]],
  });
};
