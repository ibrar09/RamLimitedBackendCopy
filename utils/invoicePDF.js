import PDFDocument from "pdfkit";
import fs from "fs";

export const createInvoicePDF = (invoice, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Add header
    doc.fontSize(20).text(`Invoice: ${invoice.invoiceNumber}`, { align: "center" });
    doc.moveDown();

    // Add billing info
    doc.fontSize(12).text(`Name: ${invoice.billingName}`);
    doc.text(`Email: ${invoice.billingEmail}`);
    doc.text(`Phone: ${invoice.billingPhone}`);
    doc.text(`Address: ${invoice.billingAddress}, ${invoice.billingCity}, ${invoice.billingCountry}, ${invoice.billingZip}`);
    doc.moveDown();

    // Add table header
    doc.text("Items:", { underline: true });
    invoice.items.forEach((item) => {
      doc.text(`${item.name} | ${item.quantity} x ${item.price} = ${item.quantity * item.price} SAR`);
    });

    doc.moveDown();
    doc.text(`Subtotal: ${invoice.subtotal} SAR`);
    doc.text(`VAT (${invoice.vatPercentage}%): ${invoice.vatAmount} SAR`);
    doc.text(`Shipping: ${invoice.shippingFee} SAR`);
    doc.text(`Discount: ${invoice.discount} SAR`);
    doc.text(`Grand Total: ${invoice.grandTotal} SAR`);

    doc.end();

    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
};
