// const Invoice = require('../models/Invoice');
// const Order = require('../models/Order');
// const generateInvoicePDF = require('../utils/invoiceGeneratePdf');
// const path = require('path');


// exports.createInvoice = async (req, res) => {
//   try {
//     const { orderId, taxRate = 0.18, dueDate } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     const amount = order.amount;
//     const tax = amount * taxRate;
//     const totalAmount = amount + tax;

//     const invoice = await Invoice.create({
//       invoiceNumber: `INV-${Date.now()}`,      
//       orderId,
//       customer: order.customer,
//       products: order.products,
//       amount,
//       tax,
//       totalAmount,
//       paymentMethod: order.paymentMethod,
//       dueDate,
//       status: order.paymentStatus === 'Success' ? 'Paid' : 'Unpaid'
//     });

//     res.status(201).json({ message: 'Invoice created', data: invoice });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating invoice', error: error.message });
//   }
// };


// exports.getInvoices = async (req, res) => {
//   try {
//     const { status, from, to } = req.query;
//     let filter = {};

//     if (status) filter.status = status;
//     if (from && to) {
//       filter.invoiceDate = {
//         $gte: new Date(from),
//         $lte: new Date(to)
//       };
//     }

//     const invoices = await Invoice.find(filter).sort({ invoiceDate: -1 });
//     res.status(200).json({ data: invoices });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching invoices', error: error.message });
//   }
// };


// exports.getInvoiceById = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id);
//     if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

//     res.status(200).json({ data: invoice });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching invoice', error: error.message });
//   }
// };


// // download invoice PDF 

// exports.downloadInvoicePDF = async (req, res) => {
//   try {
//     const invoice = await Invoice.findById(req.params.id);
//     if (!invoice) {
//       return res.status(404).json({ message: 'Invoice not found' });
//     }

//     const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
//     const filePath = path.join(__dirname, '../public/invoices', fileName);

//     await generateInvoicePDF(invoice, filePath);
//     res.download(filePath, fileName);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to generate PDF', error: error.message });
//   }
// };

const { Invoice, InvoiceSettings, Order, Product } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Generate Invoice Number (count + 1)
const generateInvoiceNumber = async () => {
  const count = await Invoice.count();
  return `INV-${String(count + 1).padStart(4, '0')}`;
};

// Auto-generate invoice when order is completed
exports.generateInvoiceOnOrderComplete = async (orderId) => {
  const order = await Order.findOne({
    where: { id: orderId, status: 'completed' },
    include: [{
      model: Product,
      as: 'products', // adjust alias to your association
      through: { attributes: ['quantity', 'price'] } // assuming many-to-many with orderProducts join table
    }]
  });
  if (!order) return;

  const settings = await InvoiceSettings.findOne() || { selectedTemplate: 'template1' };
  const invoiceNumber = await generateInvoiceNumber();

  const invoice = await Invoice.create({
    orderId,
    invoiceNumber,
    template: settings.selectedTemplate,
    generatedAt: new Date(),
  });
  
  // Optional: Generate PDF
  const pdfPath = path.join(__dirname, `../invoices/${invoiceNumber}.pdf`);
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(16).text(`Invoice: ${invoiceNumber}`);
  doc.moveDown().fontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.text(`Tax: ${settings.taxName || 'N/A'} - ${settings.taxRate || 0}%`);
  doc.moveDown();

  doc.text('Items:');
  order.products.forEach((item, i) => {
    const qty = item.OrderProduct?.quantity || 1; // adjust for your join table fields
    const price = item.OrderProduct?.price || item.price || 0;
    doc.text(`${i + 1}. ${item.title} x ${qty} - ₹${price}`);
  });

  doc.end();
};

// Update invoice settings
exports.updateInvoiceSettings = async (req, res) => {
  try {
    const { selectedTemplate, taxName, taxRate } = req.body;

    const [settings, created] = await InvoiceSettings.findOrCreate({
      where: {},
      defaults: { selectedTemplate, taxName, taxRate }
    });

    if (!created) {
      await settings.update({ selectedTemplate, taxName, taxRate });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Get invoice settings
exports.getInvoiceSettings = async (req, res) => {
  try {
    const settings = await InvoiceSettings.findOne();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// Download invoice PDF by invoiceNumber
exports.downloadInvoicePDF = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const filePath = path.join(__dirname, `../invoices/${invoiceNumber}.pdf`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: 'Download failed', error: err.message });
  }
};




