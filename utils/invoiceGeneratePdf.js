// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// const generateInvoicePDF = (invoice, filePath) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 50 });

//       const writeStream = fs.createWriteStream(filePath);
//       doc.pipe(writeStream);

//       // 🧾 Header
//       doc.fontSize(20).text('INVOICE', { align: 'center' });
//       doc.moveDown();

//       // 📅 Invoice Dates
//       doc.fontSize(12)
//         .text(`Invoice Number: ${invoice.invoiceNumber}`)
//         .text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`)
//         .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`)
//         .moveDown();

//       // 👤 Customer Info
//       doc.text('Bill To:', { underline: true });
//       doc.text(`Name: ${invoice.customer.name}`);
//       doc.text(`Email: ${invoice.customer.email}`);
//       doc.text(`Mobile: ${invoice.customer.mobile}`);
//       doc.moveDown();

//       // 📦 Products Table
//       doc.text('Products:', { underline: true });

//       invoice.products.forEach((p, index) => {
//         const total = p.price * p.quantity;
//         doc.text(
//           `${index + 1}. ${p.name} - ₹${p.price} x ${p.quantity} = ₹${total}`
//         );
//       });

//       doc.moveDown();

//       // 💰 Totals
//       doc.text(`Subtotal: ₹${invoice.amount}`);
//       doc.text(`Tax: ₹${invoice.tax}`);
//       doc.text(`Total: ₹${invoice.totalAmount}`);
//       doc.moveDown();

//       // 💳 Payment
//       doc.text(`Payment Method: ${invoice.paymentMethod}`);
//       doc.text(`Payment Status: ${invoice.status}`);
//       doc.end();

//       writeStream.on('finish', () => resolve(filePath));
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// module.exports = generateInvoicePDF;


// utils/generateInvoicePDF.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoicePDF = (invoice, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    try {
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown();

      // Invoice Info
      doc.fontSize(12)
        .text(`Invoice Number: ${invoice.invoiceNumber}`)
        .text(`Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`)
        .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`)
        .moveDown();

      // Customer Info
      doc.text('Bill To:', { underline: true });
      doc.text(`Name: ${invoice.customer.name}`);
      doc.text(`Email: ${invoice.customer.email}`);
      doc.text(`Mobile: ${invoice.customer.mobile}`).moveDown();

      // Product List
      doc.text('Products:', { underline: true });
      invoice.products.forEach((p, i) => {
        doc.text(`${i + 1}. ${p.name} - ₹${p.price} x ${p.quantity} = ₹${p.price * p.quantity}`);
      });

      doc.moveDown();

      // Totals
      doc.text(`Subtotal: ₹${invoice.amount}`);
      doc.text(`Tax: ₹${invoice.tax}`);
      doc.text(`Total: ₹${invoice.totalAmount}`).moveDown();

      // Payment
      doc.text(`Payment Method: ${invoice.paymentMethod}`);
      doc.text(`Payment Status: ${invoice.status}`);

      doc.end();

      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateInvoicePDF;
