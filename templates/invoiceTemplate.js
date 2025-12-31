import fs from "fs";
import path from "path";

export const generateInvoiceTemplate = (doc, invoice) => {
  // Optional logo
  const logoPath = path.join("assets", "logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 100 });
  }

  doc.fontSize(20).text(`Invoice: ${invoice.invoiceNumber}`, 50, 150, { underline: true });
  doc.moveDown(1.5);

  // Billing Info
  doc.fontSize(12).text(`Billing Name: ${invoice.billingName}`);
  doc.text(`Billing Email: ${invoice.billingEmail}`);
  doc.text(`Billing Phone: ${invoice.billingPhone}`);
  doc.text(`Billing Address: ${invoice.billingAddress}`);
  doc.moveDown();

  // Table Header
  doc.fontSize(12).text("Product", 50, doc.y, { width: 200 });
  doc.text("SKU", 260, doc.y);
  doc.text("Qty", 320, doc.y);
  doc.text("Unit Price", 370, doc.y);
  doc.text("Total", 450, doc.y);
  doc.moveDown();

  // Loop through items
  invoice.items.forEach((item) => {
    const y = doc.y;
    doc.text(item.product_name, 50, y, { width: 200 });
    doc.text(item.sku || "-", 260, y);
    doc.text(item.quantity.toString(), 320, y);
    doc.text(`${item.unit_price} SAR`, 370, y);
    doc.text(`${item.total_price} SAR`, 450, y);
    doc.moveDown();

    if (item.product_image && fs.existsSync(item.product_image)) {
      doc.image(item.product_image, 50, doc.y, { width: 50 });
      doc.moveDown();
    }
  });

  // Totals
  doc.moveDown();
  doc.text(`Subtotal: ${invoice.subtotal} SAR`);
  doc.text(`VAT (${invoice.vatPercentage}%): ${invoice.vatAmount} SAR`);
  doc.text(`Shipping: ${invoice.shippingFee} SAR`);
  doc.text(`Discount: ${invoice.discount} SAR`);
  doc.fontSize(16).text(`Grand Total: ${invoice.grandTotal} SAR`, { underline: true });
};
