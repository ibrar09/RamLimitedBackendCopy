// backend/utils/paymentStatus.js
export function mapTapStatusToApp(tapStatus) {
  const s = (tapStatus || "").toString().toLowerCase();

  // Map gateway statuses to Payment.status and Order.payment_status
  if (s === "initiated" || s === "init" || s === "pending") {
    return { paymentStatus: "initiated", orderPaymentStatus: "unpaid" };
  }

  if (s === "captured" || s === "paid" || s === "successful" || s === "succeeded" || s === "capture") {
    return { paymentStatus: "paid", orderPaymentStatus: "paid" };
  }

  if (s === "declined" || s === "failed" || s === "cancelled" || s === "voided") {
    return { paymentStatus: "failed", orderPaymentStatus: "failed" };
  }

  // default fallback
  return { paymentStatus: s || "unknown", orderPaymentStatus: "unpaid" };
}
