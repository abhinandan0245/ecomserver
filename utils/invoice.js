const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit"); // Make sure to install this package

// Dummy email function (replace with nodemailer/sendgrid integration if needed)
const sendEmailWithAttachment = async (to, subject, text, attachmentPath) => {
  console.log(`Simulating email to ${to} with invoice attached: ${attachmentPath}`);
};

const generateInvoiceAndSend = async (order) => {
  const doc = new PDFDocument();
  const invoicePath = path.join(__dirname, `../invoices/invoice_${order.id}.pdf`);

  // Ensure invoices folder exists
  fs.mkdirSync(path.dirname(invoicePath), { recursive: true });

  doc.pipe(fs.createWriteStream(invoicePath));

  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order ID: ${order.id}`);
  doc.text(`Customer: ${order.customerName}`);
  doc.text(`Email: ${order.customerEmail}`);
  doc.text(`Mobile: ${order.customerMobile}`);
  doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`);
  doc.moveDown();

  doc.text('Items:');
  order.OrderItems.forEach(item => {
    doc.text(`${item.Product?.title || 'Unknown Product'} - Qty: ${item.quantity}, Price: ₹${item.price}, Total: ₹${item.total}`);
  });

  doc.moveDown();
  doc.text(`Subtotal: ₹${order.subtotal}`);
  doc.text(`Tax: ₹${order.tax}`);
  doc.text(`Shipping: ₹${order.shippingRate}`);
  doc.text(`Discount: ₹${order.discount}`);
  doc.text(`Grand Total: ₹${order.grandTotal}`, { bold: true });

  doc.end();

  await sendEmailWithAttachment(order.customerEmail, "Your Invoice", "Please find your invoice attached.", invoicePath);
};

module.exports = generateInvoiceAndSend;
