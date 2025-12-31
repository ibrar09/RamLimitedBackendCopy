export const buildInvoiceData = ({ order, invoiceNumber }) => {
  if (!order || !order.items || !order.items.length) {
    throw new Error("Order items missing");
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatPercentage = 15;
  const vatAmount = +(subtotal * vatPercentage / 100).toFixed(2);
  const shippingFee = order.shippingFee || 0;
  const discount = order.discount || 0;
  const grandTotal = +(subtotal + vatAmount + shippingFee - discount).toFixed(2);

  return {
    invoiceNumber,
    orderId: order.id,
    userId: order.userId,
    billingName: order.billing.name,
    billingEmail: order.billing.email,
    billingPhone: order.billing.phone,
    billingAddress: order.billing.address,
    billingCity: order.billing.city,
    billingCountry: order.billing.country,
    billingZip: order.billing.zip,
    items: order.items,
    subtotal: +subtotal.toFixed(2),
    vatPercentage,
    vatAmount,
    shippingFee,
    discount,
    grandTotal,
    currency: "SAR",
    paymentMethod: order.paymentMethod,
    paymentStatus: "PAID",
    vatNumber: "300123456700003",
  };
};
