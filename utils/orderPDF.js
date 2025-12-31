import PDFDocument from "pdfkit";

export function generateOrderPDF(res, order) {
  const doc = new PDFDocument({ margin: 40 });

  doc.pipe(res);

  // Logo
  if (order.companyLogo) {
    doc.image(order.companyLogo, 40, 20, { width: 70 });
  }

  doc.fontSize(20).text(order.companyName, 120, 30);
  doc.moveDown(2);

  // ORDER SUMMARY
  doc.fontSize(16).text("Order Summary", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Order ID: ${order.id}`);
  doc.text(`Order Number: ${order.order_number}`);
  doc.text(`Status: ${order.status}`);
  doc.text(`Payment Status: ${order.payment_status}`);
  doc.text(`Order Date: ${order.created_at}`);
  doc.moveDown();

  // CUSTOMER INFO
  doc.fontSize(16).text("Customer Information", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Name: ${order.customer.name}`);
  doc.text(`Email: ${order.customer.email}`);
  doc.text(`Phone: ${order.customer.phone}`);
  doc.text(`Address: ${order.customer.address}`);
  doc.moveDown();

  // DELIVERY
  doc.fontSize(16).text("Delivery Details", { underline: true });
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Delivery Status: ${order.delivery_status}`);
  doc.text(`City: ${order.city}`);
  doc.text(`Country: ${order.country}`);
  doc.moveDown();

  // ITEMS TABLE
  doc.fontSize(16).text("Order Items", { underline: true });
  doc.moveDown();

  doc.fontSize(12);
  doc.text("Product", 40);
  doc.text("Qty", 200);
  doc.text("Price", 260);
  doc.text("Total", 330);
  doc.moveDown(0.5);

  order.items.forEach((item) => {
    doc.text(item.product_name, 40);
    doc.text(item.quantity.toString(), 200);
    doc.text(item.price.toString(), 260);
    doc.text((item.price * item.quantity).toString(), 330);
    doc.moveDown(0.5);
  });

  doc.moveDown(1);

  // FOOTER
  doc.fontSize(12).text("Thank you for using MAAJ Admin Portal", {
    align: "center",
  });

  doc.end();

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=order_${order.id}.pdf`
  );
}
