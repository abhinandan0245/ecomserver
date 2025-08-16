// const moment = require('moment');
// const json2csv = require('json2csv').parse;
// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');
// const { Op } = require('sequelize');
// const User = require('../models/User');
// const Invoice = require('../models/Invoice');
// const Order = require('../models/Order');
// const InvoiceSettings = require('../models/InvoiceSettings');
// const sendInvoiceEmail = require('../utils/emailSender');
// const Customer = require('../models/Customer');


// const generateOrderId = () => {
//   return Math.floor(100000 + Math.random() * 900000);
// };

// const generateInvoiceNumber = async () => {
//   const count = await Invoice.count();
//   // return `INV-${String(count + 1).padStart(4, '0')}`;
//   return `INV-${Date.now()}`;
// };

// const invoiceNumber = `INV-${Date.now()}`; // or your custom format

// exports.createOrder = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const user = await Customer.findByPk(userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const {
//       products,
//       address,
//       paymentMethod,
//       tax = 0,          // % value
//       shippingRate = 0,
//       discount = 0      // % value
//     } = req.body;

//     if (!products || !address || !paymentMethod) {
//       return res.status(400).json({ msg: 'Missing required fields' });
//     }

//     const productsArray = typeof products === 'string' ? JSON.parse(products) : products;

//     const subtotal = productsArray.reduce(
//       (sum, item) => sum + item.price * (item.qty ?? item.quantity ?? 1),
//       0
//     );

//     // Calculate amounts

    
//     const discountAmount = subtotal * (Number(discount) / 100);
//     const afterDiscount = subtotal - discountAmount;

//     const totalBeforeTax = afterDiscount + Number(shippingRate);
//     const taxAmount = totalBeforeTax * (Number(tax) / 100);
//     const grandTotal = totalBeforeTax + taxAmount;

    

//     // Auto-set statuses
//     const orderStatus = 'Pending';
//     const paymentStatus = paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Success';

//     const order = await Order.create({
//       orderId: generateOrderId(),
//       customerName: user.name,
//       customerEmail: user.email,
//       customerMobile: user.mobile || '',
//       paymentMethod,
//       amount: subtotal,
//       paymentStatus,
//       orderStatus,
//       orderDate: new Date(),
//       products: productsArray,
//       address,
//       subtotal,
//       tax: taxAmount,
//       shippingRate,
//       discount: discountAmount,
//       grandTotal,
//     });

//     if (paymentStatus === 'Success' && orderStatus === 'Pending') {
//       await exports.generateInvoiceOnOrderComplete(order.id);
//     }

//     res.status(201).json({ msg: 'Order created successfully', order });
//   } catch (err) {
//     console.error(' Error creating order:', err);
//     res.status(500).json({ msg: 'Internal server error' });
//   }
// };





// exports.generateInvoiceOnOrderComplete = async (orderId) => {
//   try {
//     const order = await Order.findByPk(orderId);
//     if (!order || order.paymentStatus !== 'Success') {
//   console.warn(`Order not found or payment not successful: ${orderId}`);
//   return;
// }

//     const settings = await InvoiceSettings.findOne() || {
//       selectedTemplate: 'template1',
//       taxName: 'GST',
//       taxRate: 0,
//     };

//     const invoiceNumber = await generateInvoiceNumber();

//     // Save invoice record
//     await Invoice.create({
//       orderId,
//       invoiceNumber,
//       template: settings.selectedTemplate,
//       generatedAt: new Date(),
//     });

//     // Create invoice folder if not exist
//     const invoiceDir = path.join(__dirname, '../invoices');
//     if (!fs.existsSync(invoiceDir)) {
//       fs.mkdirSync(invoiceDir, { recursive: true });
//     }

//     const pdfPath = path.join(invoiceDir, `${invoiceNumber}.pdf`);
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(pdfPath));

//     // PDF Content
//     doc.fontSize(20).text('INVOICE', { align: 'center' });
//     doc.moveDown();

//     doc.fontSize(14).text(`Invoice Number: ${invoiceNumber}`);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`);
//     doc.text(`Customer: ${order.customerName}`);
//     doc.text(`Email: ${order.customerEmail}`);
//     doc.text(`Mobile: ${order.customerMobile}`);
//     doc.text(`Payment Method: ${order.paymentMethod}`);
//     doc.text(`Order ID: ${order.orderId}`);
//     doc.moveDown();

//     doc.text(`Tax: ${settings.taxName || 'N/A'} - ${settings.taxRate || 0}%`);
//     doc.moveDown();

//     // Get and parse products
//     let products = order.products;
//     if (typeof products === 'string') {
//       try {
//         products = JSON.parse(products);
//       } catch (e) {
//         console.error('❌ Failed to parse products JSON:', e.message);
//         products = [];
//       }
//     }

//     doc.fontSize(16).text('Order Items:', { underline: true });

//     let totalAmount = 0;
//     if (Array.isArray(products)) {
//       products.forEach((item, index) => {
//         const title = item.title || item.name || 'Unnamed Product';
//         const quantity = item.qty || item.quantity || 1;
//         const price = item.price || 0;
//         const lineTotal = quantity * price;
//         totalAmount += lineTotal;

//         doc.fontSize(12).text(
//           `${index + 1}. ${title} x ${quantity} - ₹${price} (Total: ₹${lineTotal})`
//         );
//       });
//     } else {
//       doc.fontSize(12).text('No product details available.');
//     }

//     doc.moveDown();
//     doc.fontSize(14).text(`Total Amount: ₹${totalAmount}`, { align: 'right' });

//     doc.end();

//     await new Promise((resolve, reject) => {
//       doc.on('end', resolve);
//       doc.on('error', reject);
//     });

//     await sendInvoiceEmail(order.customerEmail, pdfPath, invoiceNumber);

//     console.log(`✅ Invoice generated and emailed: ${pdfPath}`);
//   } catch (error) {
//     console.error('❌ Failed to generate/send invoice:', error.message);
//   }
// };





// exports.getAllOrders = async (req, res) => {
//   try {
//     const { status } = req.query;
//     const where = {};

//     if (status) where.orderStatus = status;
//     // if (from && to) where.orderDate = { [Op.between]: [new Date(from), new Date(to)] };
//     // if (search) {
//     //   where[Op.or] = [
//     //     { orderId: { [Op.like]: `%${search}%` } },
//     //     { customerName: { [Op.like]: `%${search}%` } },
//     //     { customerEmail: { [Op.like]: `%${search}%` } }
//     //   ];
//     // }

//     const orders = await Order.findAll({ where, order: [['orderDate', 'DESC']] });
//     res.status(200).json({ success: true, data: orders });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// };

// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     const invoice = await Invoice.findOne({ where: { orderId: order.id } });

//     res.status(200).json({
//       success: true,
//       data: {
//         ...order.toJSON(),
//         invoiceNumber: invoice?.invoiceNumber || null,
//         invoiceGeneratedAt: invoice?.generatedAt || null,
//         invoiceTemplate: invoice?.template || null
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// exports.cancelOrder = async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Optional: Prevent canceling already cancelled/completed orders
//     if (['Cancelled', 'Completed', 'Failed'].includes(order.orderStatus)) {
//       return res.status(400).json({ message: `Cannot cancel an order with status: ${order.orderStatus}` });
//     }

//     await order.update({
//       orderStatus: 'Cancelled',
//       paymentStatus: 'Refund Initiated' // or 'Failed' if no payment was done
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Order cancelled successfully !',
//       data: order
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: err.message || 'Something went wrong'
//     });
//   }
// };


// exports.exportOrders = async (req, res) => {
//   try {
//     const orders = await Order.findAll();
//     const csv = json2csv(orders.map(order => order.toJSON()));
//     res.header('Content-Type', 'text/csv');
//     res.attachment('orders.csv');
//     res.send(csv);
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Export failed', error: err.message });
//   }
// };

// exports.getDropdownOptions = (req, res) => {
//   res.json({
//     paymentStatus: ['Success', 'Failed', 'Pending'],
//     orderStatus: ['Success', 'Failed', 'Pending'],
//     paymentMethods: ['Debit Card', 'Credit Card', 'UPI', 'Cash on Delivery']
//   });
// };

// exports.getDeliveredOrders = async (req, res) => {
//   try {
//     const { from, to, search } = req.query;
//     const where = { orderStatus: 'Success' };

//     if (from && to) where.orderDate = { [Op.between]: [new Date(from), new Date(to)] };
//     if (search) {
//       where[Op.or] = [
//         { orderId: { [Op.like]: `%${search}%` } },
//         { customerName: { [Op.like]: `%${search}%` } },
//         { customerEmail: { [Op.like]: `%${search}%` } }
//       ];
//     }

//     const deliveredOrders = await Order.findAll({ where, order: [['orderDate', 'DESC']] });
//     res.status(200).json({ success: true, count: deliveredOrders.length, data: deliveredOrders });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to fetch delivered orders', error: error.message });
//   }
// };





// // exports.generateInvoiceOnOrderComplete = async (orderId) => {
// //   try {
// //     const order = await Order.findByPk(orderId);
// //     if (!order || order.orderStatus !== 'Success') {
// //       console.warn(`Order not found or not successful: ${orderId}`);
// //       return;
// //     }

// //     const settings = await InvoiceSettings.findOne() || {
// //       selectedTemplate: 'template1',
// //       taxName: 'GST',
// //       taxRate: 0,
// //     };

// //     const invoiceNumber = await generateInvoiceNumber();

// //     // Save invoice to DB
// //     const invoice = await Invoice.create({
// //       orderId,
// //       invoiceNumber,
// //       template: settings.selectedTemplate,
// //       generatedAt: new Date(),
// //     });

// //     // Ensure invoice folder exists
// //     const invoiceDir = path.join(__dirname, '../invoices');
// //     if (!fs.existsSync(invoiceDir)) {
// //       fs.mkdirSync(invoiceDir, { recursive: true });
// //     }

// //     // Generate PDF
// //     const pdfPath = path.join(invoiceDir, `${invoiceNumber}.pdf`);
// //     const doc = new PDFDocument();
// //     doc.pipe(fs.createWriteStream(pdfPath));

// //     // PDF Content
// //     doc.fontSize(20).text(`INVOICE`, { align: 'center' });
// //     doc.moveDown();
// //     doc.fontSize(14).text(`Invoice Number: ${invoiceNumber}`);
// //     doc.text(`Date: ${new Date().toLocaleDateString()}`);
// //     doc.text(`Customer: ${order.customerName}`);
// //     doc.text(`Email: ${order.customerEmail}`);
// //     doc.text(`Mobile: ${order.customerMobile}`);
// //     doc.text(`Payment Method: ${order.paymentMethod}`);
// //     doc.text(`Order ID: ${order.orderId}`);
// //     doc.moveDown();
// //     doc.text(`Tax: ${settings.taxName || 'N/A'} - ${settings.taxRate || 0}%`);
// //     doc.moveDown();

// //     const products = Array.isArray(order.products) ? order.products : [];
// //     doc.fontSize(16).text('Order Items:', { underline: true });
// //     products.forEach((item, index) => {
// //       doc.fontSize(12).text(`${index + 1}. ${item.title || 'Product'} x ${item.qty || 1} - ₹${item.price}`);
// //     });

// //     doc.end();

// //     // Wait a moment before trying to email
// //     await new Promise((resolve) => setTimeout(resolve, 1000));
// //     await sendInvoiceEmail(order.customerEmail, pdfPath, invoiceNumber);
// //     console.log(`✅ Invoice emailed to ${order.customerEmail}`);
// //   } catch (error) {
// //     console.error('❌ Failed to generate and email invoice:', error.message);
// //   }
// // };

// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const order = await Order.findByPk(id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     await order.update({ orderStatus: status });
//     if (status === 'Success') await exports.generateInvoiceOnOrderComplete(order.id);

//     res.json({ message: 'Order updated', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating order', error: error.message });
//   }
// };



// // ✅ Updated Order Controller with Razorpay Order Placement Handling
// const moment = require('moment');
// const { Op, Sequelize } = require('sequelize');
// const sequelize = require('../config/db'); // Make sure this path is correct
// const Order = require('../models/Order');
// const OrderItem = require('../models/OrderItem');
// const Product = require('../models/Product');
// const Invoice = require('../models/Invoice');
// const Customer = require('../models/Customer');
// const Cart = require('../models/Cart');
// const Transaction = require('../models/Transaction');
// const ccAvenue = require('../config/ccAvenue');

// const generateOrderId = () => 'ORD' + Math.floor(100000 + Math.random() * 900000);
// const generateInvoiceNumber = () => 'INV' + Date.now();

// exports.createOrder = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const userId = req.userId;
//     const user = await Customer.findByPk(userId, { transaction: t });
//     if (!user) {
//       await t.rollback();
//       return res.status(404).json({ success: false, msg: 'User not found' });
//     }

//     const {
//       products,
//       paymentMethod,
//       shippingName,
//       shippingEmail,
//       shippingAddress,
//       shippingCity,
//       shippingState,
//       shippingPostalCode,
//       shippingCountry,
//       shippingPhone,
//       subtotal,
//       tax,
//       shippingRate,
//       discount,
//       grandTotal
//     } = req.body;

//     // Validate products and stock
//     for (const item of products) {
//       const product = await Product.findByPk(item.productId, { transaction: t });
//       if (!product) {
//         await t.rollback();
//         return res.status(400).json({ 
//           success: false, 
//           msg: `Product with ID ${item.productId} not found`,
//           productId: item.productId
//         });
//       }
//       if (product.stock < item.quantity) {
//         await t.rollback();
//         return res.status(400).json({ 
//           success: false, 
//           msg: `Only ${product.stock} items available for ${product.title}`,
//           productId: item.productId,
//           availableStock: product.stock
//         });
//       }
//     }

//     // Create order
//     const order = await Order.create({
//       orderId: generateOrderId(),
//       customerId: userId,
//       paymentMethod: paymentMethod === 'paypal' ? 'Credit Card' : 'Cash on Delivery',
//       amount: grandTotal,
//       paymentStatus: 'Pending',
//       orderStatus: 'Pending',
//       subtotal,
//       tax,
//       shippingRate,
//       discount,
//       grandTotal,
//       shippingName,
//       shippingEmail,
//       shippingAddress,
//       shippingCity,
//       shippingState,
//       shippingPostalCode,
//       shippingCountry,
//       shippingPhone,
//       orderDate: new Date()
//     }, { transaction: t });

//     // Create order items and update stock
//     await Promise.all(products.map(async (item) => {
//       await OrderItem.create({
//         orderId: order.id,
//         productId: item.productId,
//         title: item.title || 'Product',
//         quantity: item.quantity,
//         price: item.price,
//         total: item.price * item.quantity,
//       }, { transaction: t });

//       await Product.decrement('stock', {
//         by: item.quantity,
//         where: { id: item.productId },
//         transaction: t
//       });
//     }));

//     // Handle Cash on Delivery
//     if (paymentMethod === 'delivery') {
//       // Create transaction record
//       await Transaction.create({
//         transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
//         orderId: order.orderId,
//         customerName: shippingName,
//         paymentMethod: 'Cash on Delivery',
//         amount: grandTotal,
//         status: 'pending',
//       }, { transaction: t });

//       // Create invoice
//       await Invoice.create({
//         invoiceNumber: generateInvoiceNumber(),
//         orderId: order.id,
//         customerId: userId,
//         issueDate: new Date(),
//         dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
//         status: 'pending',
//         amount: grandTotal,
//         tax,
//         discount,
//         shipping: shippingRate,
//         total: grandTotal,
//       }, { transaction: t });

//       // Clear cart
//       await Cart.destroy({ where: { customerId: userId }, transaction: t });

//       await t.commit();

//       return res.status(201).json({
//         success: true,
//         msg: 'COD order created successfully',
//         order,
//         paymentRequired: false
//       });
//     }

//     // Handle CC Avenue Payment
//     if (paymentMethod === 'paypal') {
//       // Create transaction record
//       const transactionRecord = await Transaction.create({
//         transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
//         orderId: order.orderId,
//         customerName: shippingName,
//         paymentMethod: 'Credit Card',
//         amount: grandTotal,
//         status: 'pending',
//       }, { transaction: t });

//       // Prepare CC Avenue request data
//       const merchantData = {
//         merchant_id: ccAvenue.merchantId,
//         order_id: order.orderId,
//         amount: grandTotal.toFixed(2),
//         currency: 'INR',
//         redirect_url: `${process.env.BASE_URL}/api/payment/ccavenue/callback`,
//         cancel_url: `${process.env.BASE_URL}/api/payment/ccavenue/callback`,
//         language: 'EN',
//         billing_name: shippingName,
//         billing_email: shippingEmail,
//         billing_tel: shippingPhone,
//         merchant_param1: transactionRecord.transactionId,
//         billing_notes: JSON.stringify({
//           customerId: userId,
//           products: products.map(p => ({
//             id: p.productId,
//             name: p.title,
//             quantity: p.quantity
//           }))
//         })
//       };

//       // Encrypt the merchant data
//       const encryptedData = ccAvenue.encrypt(JSON.stringify(merchantData));

//       await t.commit();

//       return res.status(200).json({
//         success: true,
//         msg: 'Payment required',
//         // In createOrder controller
//         paymentUrl: `${process.env.CCAVENUE_PAYMENT_URL}/transaction/transaction.do?command=initiateTransaction&encRequest=${encodeURIComponent(encryptedData)}&access_code=${ccAvenue.accessCode}`,
//         orderId: order.orderId,
//         transactionId: transactionRecord.transactionId,
//         paymentRequired: true
//       });
//     }

//     await t.rollback();
//     return res.status(400).json({ 
//       success: false, 
//       msg: 'Invalid payment method' 
//     });

//   } catch (err) {
//     await t.rollback();
//     console.error('Order creation error:', err);
//     res.status(500).json({ 
//       success: false,
//       msg: 'Internal server error',
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };






// controllers/orderController.js
const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Cart = require('../models/Cart');
const Transaction = require('../models/Transaction');
const ccAvenue = require('../config/ccAvenue');
const qs = require('querystring');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const sendInvoiceEmail = require('../utils/sendInvoiceEmail');
const generateInvoicePDF = require('../utils/generateInvoicePDF');

const generateOrderId = () => 'ORD' + Math.floor(100000 + Math.random() * 900000);
const generateInvoiceNumber = () => 'INV' + Date.now();

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.userId;
    const user = await Customer.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const {
      products = [],
      paymentMethod,             // EXPECT: 'cod' | 'ccavenue'
      shippingName,
      shippingEmail,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      shippingPhone,
      subtotal,
      tax,
      shippingRate,
      discount,
      grandTotal
    } = req.body;

    // Validate stock
    for (const item of products) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(400).json({ success: false, msg: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ success: false, msg: `Only ${product.stock} left for ${product.title || product.name}` });
      }
    }

    // --- COD flow: make order now ---
    if (paymentMethod === 'cod') {
      const order = await Order.create({
        orderId: generateOrderId(),
        customerId: userId,
        paymentMethod: 'COD',
        amount: grandTotal,
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        subtotal,
        tax,
        shippingRate,
        discount,
        grandTotal,
        shippingName,
        shippingEmail,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingPostalCode,
        shippingCountry,
        shippingPhone,
        orderDate: new Date()
      }, { transaction: t });

      // items + stock
      await Promise.all(products.map(async (item) => {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          title: item.title || 'Product',
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        }, { transaction: t });

        await Product.decrement('stock', {
          by: item.quantity,
          where: { id: item.productId },
          transaction: t
        });
      }));

      await Transaction.create({
        transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
        orderId: order.orderId,
        customerId: userId,
        customerName: shippingName,
        paymentMethod: 'COD',
        gateway: 'COD',
        amount: grandTotal,
        status: 'pending',
      }, { transaction: t });

      await Invoice.create({
  orderId: order.id,
  orderNumber: order.orderId, // Business order ID like "ORDxxxxxx"
  invoiceNumber: generateInvoiceNumber(),
  customerName: shippingName,
  customerEmail: shippingEmail,
  customerPhone: shippingPhone || null,
  billingAddress: `${shippingAddress}, ${shippingCity}, ${shippingState}, ${shippingPostalCode}, ${shippingCountry}`,
  items: products.map(item => ({
    title: item.title || 'Product',
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity
  })),
  subtotal,
  tax,
  shipping: shippingRate,
  discount,
  total: grandTotal,
  generatedAt: new Date()
}, { transaction: t });

      await Cart.destroy({ where: { customerId: userId }, transaction: t });

      await t.commit();

      // ✅ Fetch invoice + items for email
const invoice = await Invoice.findOne({ where: { orderId: order.id } });
const orderItems = await OrderItem.findAll({ where: { orderId: order.id } });

const invoiceData = {
  orderNumber: order.orderId,
  invoiceNumber: invoice.invoiceNumber,
  customerName: shippingName,
  customerEmail: shippingEmail,
  generatedAt: invoice.generatedAt,
  items: orderItems.map(i => ({
    title: i.title,
    quantity: i.quantity,
    price: i.price,
    total: i.price * i.quantity
  })),
  subtotal,
  tax,
  shipping: shippingRate,
  discount,
  total: grandTotal
};

const pdfPath = await generateInvoicePDF(invoiceData);
await sendInvoiceEmail(shippingEmail, pdfPath, invoice.invoiceNumber);


      return res.status(201).json({
        success: true,
        msg: 'COD order created successfully',
        order,
        paymentRequired: false
      });
    }

    // --- CCAvenue flow: create only a Transaction now; order later on callback ---
    if (paymentMethod === 'ccavenue') {
      const orderId = generateOrderId();

      const transactionRecord = await Transaction.create({
        transactionId: 'TXN' + Math.floor(100000 + Math.random() * 900000),
        orderId,                     // provisional id to sync with gateway
        customerId: userId,
        customerName: shippingName,
        paymentMethod: 'CCAVENUE',
        gateway: 'CCAVENUE',
        amount: grandTotal,
        status: 'initiated',
        meta: JSON.stringify({
          customerId: userId,
          products,
          shipping: {
            shippingName,
            shippingEmail,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingPostalCode,
            shippingCountry,
            shippingPhone,
          },
          totals: { subtotal, tax, shippingRate, discount, grandTotal }
        })
      }, { transaction: t });

      // Build merchant data as x-www-form-urlencoded (what CCAvenue expects before encryption)
      const merchantData = {
        merchant_id: ccAvenue.merchantId,
        order_id: orderId,
        amount: Number(grandTotal).toFixed(2),
        currency: 'INR',
        redirect_url: process.env.CALLBACK_URL,
        cancel_url: process.env.CALLBACK_URL,
        language: 'EN',

        billing_name: shippingName,
        billing_email: shippingEmail,
        billing_tel: shippingPhone,

        // pass our transaction id for lookup on callback
        merchant_param1: transactionRecord.transactionId,
      };

      const encRequest = ccAvenue.encrypt(qs.stringify(merchantData));
      await t.commit();

      // Return POST payload parts (not a GET link!)
      return res.status(200).json({
        success: true,
        paymentRequired: true,
        gateway: {
          actionUrl: `${ccAvenue.baseUrl}/transaction/transaction.do?command=initiateTransaction`,
          encRequest,
          accessCode: process.env.CCAVENUE_ACCESS_CODE,
        },
        orderId,
        transactionId: transactionRecord.transactionId,
      });
    }

    await t.rollback();
    return res.status(400).json({ success: false, msg: 'Invalid payment method' });

  } catch (err) {
    await t.rollback();
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, msg: 'Internal server error' });
  }
};


exports.handleCCAvenueCallback = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const encryptedResponse = req.body.encResp;
    if (!encryptedResponse) {
      await t.rollback();
      return res.status(400).json({ 
        success: false,
        msg: 'No payment response received' 
      });
    }

    // Decrypt the response
    const decryptedResponse = ccAvenue.decrypt(encryptedResponse);
    const response = JSON.parse(decryptedResponse);
    
    console.log('CC Avenue Response:', response); // For debugging

    // Validate required fields
    if (!response.order_id || !response.order_status) {
      await t.rollback();
      return res.status(400).json({ 
        success: false,
        msg: 'Invalid payment response format' 
      });
    }

    // Find the transaction record
    const transactionRecord = await Transaction.findOne({
      where: { transactionId: response.merchant_param1 },
      transaction: t
    });

    if (!transactionRecord) {
      await t.rollback();
      return res.status(404).json({ 
        success: false,
        msg: 'Transaction not found' 
      });
    }

    // Find the order
    const order = await Order.findOne({
      where: { orderId: response.order_id },
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ 
        success: false,
        msg: 'Order not found' 
      });
    }

    // Update transaction status
    transactionRecord.status = response.order_status === 'Success' ? 'success' : 'failed';
    transactionRecord.paymentId = response.bank_ref_no || null;
    transactionRecord.responseData = response;
    await transactionRecord.save({ transaction: t });

    // Handle successful payment
    if (response.order_status === 'Success') {
      // Verify amount matches
      if (parseFloat(response.amount) !== parseFloat(order.grandTotal)) {
        await t.rollback();
        return res.status(400).json({ 
          success: false,
          msg: 'Payment amount mismatch' 
        });
      }

      // Update order status
      await order.update({
        paymentStatus: 'Paid',
        orderStatus: 'Processing'
      }, { transaction: t });

      // Create invoice if not exists
      const existingInvoice = await Invoice.findOne({
        where: { orderId: order.id },
        transaction: t
      });

      if (!existingInvoice) {
        await Invoice.create({
          invoiceNumber: generateInvoiceNumber(),
          orderId: order.id,
          customerId: order.customerId,
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          status: 'paid',
          amount: order.grandTotal,
          tax: order.tax,
          discount: order.discount,
          shipping: order.shippingRate,
          total: order.grandTotal,
        }, { transaction: t });
      }

      // Clear cart
      await Cart.destroy({
        where: { customerId: order.customerId },
        transaction: t
      });

      await t.commit();

      // ✅ Fetch invoice + items for email
const invoice = await Invoice.findOne({ where: { orderId: order.id } });
const orderItems = await OrderItem.findAll({ where: { orderId: order.id } });

const invoiceData = {
  orderNumber: order.orderId,
  invoiceNumber: invoice.invoiceNumber,
  customerName: order.shippingName,
  customerEmail: order.shippingEmail,
  generatedAt: invoice.generatedAt,
  items: orderItems.map(i => ({
    title: i.title,
    quantity: i.quantity,
    price: i.price,
    total: i.price * i.quantity
  })),
  subtotal: order.subtotal,
  tax: order.tax,
  shipping: order.shippingRate,
  discount: order.discount,
  total: order.grandTotal
};

const pdfPath = await generateInvoicePDF(invoiceData);
await sendInvoiceEmail(order.shippingEmail, pdfPath, invoice.invoiceNumber);

      // Redirect to frontend success page
      return res.redirect(`${process.env.FRONTEND_URL}/thankyou?order_id=${order.orderId}&status=success`);
    }

    // Handle failed payment
    await order.update({
      paymentStatus: 'Failed',
      orderStatus: 'Failed',
      paymentNote: response.failure_message || 'Payment failed'
    }, { transaction: t });

    await t.commit();
    return res.redirect(`${process.env.FRONTEND_URL}/thankyou?order_id=${order.orderId}&status=failed`);

  } catch (err) {
    await t.rollback();
    console.error('CC Avenue callback error:', err);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
  }
};

exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      where: { orderId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: Invoice,
          as: 'invoice'
        },
        {
          model: Transaction,
          as: 'transactions',
          where: { status: 'success' },
          required: false
        }
      ],
      order: [
        [{ model: Transaction, as: 'transactions' }, 'createdAt', 'DESC']
      ]
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        msg: 'Order not found' 
      });
    }

    // Verify order belongs to requesting user (if needed)
    // if (req.userId && order.customerId !== req.userId) {
    //   return res.status(403).json({ 
    //     success: false,
    //     msg: 'Not authorized to view this order' 
    //   });
    // }

    // Format response
    const response = {
      success: true,
      order: {
        id: order.id,
        orderId: order.orderId,
        customerId: order.customerId,
        customerName: order.shippingName,
        customerEmail: order.shippingEmail,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        orderDate: order.orderDate,
        amount: order.amount,
        subtotal: order.subtotal,
        tax: order.tax,
        shippingRate: order.shippingRate,
        discount: order.discount,
        grandTotal: order.grandTotal,
        shippingAddress: {
          name: order.shippingName,
          address: order.shippingAddress,
          city: order.shippingCity,
          state: order.shippingState,
          postalCode: order.shippingPostalCode,
          country: order.shippingCountry,
          phone: order.shippingPhone
        },
        items: order.orderItems.map(item => ({
          id: item.id,
          productId: item.productId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          product: item.product ? {
            id: item.product.id,
            title: item.product.title,
            image: item.product.image
          } : null
        })),
        invoice: order.invoice ? {
          invoiceNumber: order.invoice.invoiceNumber,
          issueDate: order.invoice.issueDate,
          dueDate: order.invoice.dueDate,
          status: order.invoice.status,
          amount: order.invoice.amount,
          tax: order.invoice.tax,
          discount: order.invoice.discount,
          shipping: order.invoice.shipping,
          total: order.invoice.total
        } : null,
        transaction: order.transactions && order.transactions.length > 0 ? {
          id: order.transactions[0].id,
          transactionId: order.transactions[0].transactionId,
          paymentId: order.transactions[0].paymentId,
          date: order.transactions[0].date,
          status: order.transactions[0].status
        } : null
      }
    };

    res.json(response);

  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ 
      success: false,
      msg: 'Internal server error' 
    });
  }
};

// Add this to your orderController
exports.confirmPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { orderId, paymentDetails } = req.body;
    
    // Verify payment with CC Avenue
    const paymentVerified = await verifyCCAvenuePayment(paymentDetails);
    
    if (!paymentVerified) {
      await t.rollback();
      return res.status(400).json({ success: false, msg: 'Payment verification failed' });
    }

    // Update order status
    await Order.update({
      paymentStatus: 'Paid',
      orderStatus: 'Processing'
    }, { where: { orderId }, transaction: t });

    // Create transaction record
    await Transaction.create({
      // ... transaction details
    }, { transaction: t });

    await t.commit();
    return res.json({ success: true, orderId });

  } catch (err) {
    await t.rollback();
    console.error('Payment confirmation error:', err);
    res.status(500).json({ success: false, msg: 'Payment processing failed' });
  }
};






exports.generateInvoiceOnOrderComplete = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order || order.paymentStatus !== 'Success') {
      console.warn(`Order not found or payment not successful: ${orderId}`);
      return;
    }

    const items = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product, as: 'product' }]
    });

    const invoiceNumber = 'INV' + Date.now();
    const productDetails = items.map(item => ({
      title: item.product?.title || 'Unnamed Product',
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    }));

    const subtotal = productDetails.reduce((sum, p) => sum + p.total, 0);
    const tax = order.tax || 0;
    const shipping = order.shippingRate || 0;
    const discount = order.discount || 0;
    const grandTotal = subtotal + tax + shipping - discount;

    // Save invoice record
    await Invoice.create({
      orderId: order.id,
      invoiceNumber,
      customerName: order.shippingName,
      customerEmail: order.shippingEmail,
      customerPhone: order.shippingPhone,
      billingAddress: order.shippingAddress,
      items: productDetails,
      subtotal,
      tax,
      shipping,
      discount,
      total: grandTotal
    });

    // Generate PDF
    const invoiceDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

    const pdfPath = path.join(invoiceDir, `${invoiceNumber}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(pdfPath));

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Customer Info
    doc.text(`Customer: ${order.shippingName}`);
    doc.text(`Email: ${order.shippingEmail}`);
    doc.text(`Phone: ${order.shippingPhone}`);
    doc.text(`Billing Address: ${order.shippingAddress}`);
    doc.moveDown();

    // Table Header
    doc.fontSize(12).text('Item', 50, doc.y, { width: 200 });
    doc.text('Qty', 300, doc.y, { width: 50 });
    doc.text('Price', 350, doc.y, { width: 100 });
    doc.text('Total', 450, doc.y, { width: 100 });
    doc.moveDown();

    // Table Rows
    productDetails.forEach(p => {
      doc.text(p.title, 50, doc.y, { width: 200 });
      doc.text(p.quantity.toString(), 300, doc.y, { width: 50 });
      doc.text(`₹${p.price}`, 350, doc.y, { width: 100 });
      doc.text(`₹${p.total}`, 450, doc.y, { width: 100 });
      doc.moveDown();
    });

    // Totals
    doc.moveDown();
    doc.text(`Subtotal: ₹${subtotal}`, { align: 'right' });
    doc.text(`Tax: ₹${tax}`, { align: 'right' });
    doc.text(`Shipping: ₹${shipping}`, { align: 'right' });
    doc.text(`Discount: ₹${discount}`, { align: 'right' });
    doc.fontSize(14).text(`Grand Total: ₹${grandTotal}`, { align: 'right', underline: true });

    doc.end();

    await sendInvoiceEmail(order.shippingEmail, pdfPath, invoiceNumber);
    console.log(`✅ Invoice generated and emailed: ${pdfPath}`);

  } catch (error) {
    console.error('❌ Failed to generate/send invoice:', error.message);
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status) where.orderStatus = status;

    const orders = await Order.findAll({ where, order: [['orderDate', 'DESC']] });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [{ model: Product, as: 'product' }] }]
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const invoice = await Invoice.findOne({ where: { orderId: order.id } });

    res.status(200).json({
      success: true,
      data: {
        ...order.toJSON(),
        invoiceNumber: invoice?.invoiceNumber || null,
        invoiceGeneratedAt: invoice?.generatedAt || null,
        invoiceTemplate: invoice?.template || null
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (['Cancelled', 'Completed', 'Failed'].includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot cancel an order with status: ${order.orderStatus}` });
    }

    await order.update({
      orderStatus: 'Cancelled',
      paymentStatus: 'Refund Initiated'
    });

    res.status(200).json({ success: true, message: 'Order cancelled successfully!', data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Something went wrong' });
  }
};

exports.exportOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    const csv = json2csv(orders.map(order => order.toJSON()));
    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Export failed', error: err.message });
  }
};

exports.getDropdownOptions = (req, res) => {
  res.json({
    paymentStatus: ['Success', 'Failed', 'Pending'],
    orderStatus: ['Success', 'Failed', 'Pending'],
    paymentMethods: ['Debit Card', 'Credit Card', 'UPI', 'Cash on Delivery']
  });
};

// delivered order controller





exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status = 'Delivered', from, to, search } = req.query;

    const where = {};

    if (status) {
      where.orderStatus = status;
    }

    if (from && to) {
      where.orderDate = {
        [Op.between]: [new Date(from), new Date(to)],
      };
    }

    if (search) {
      where[Op.or] = [
        { orderId: { [Op.like]: `%${search}%` } },
        { customerName: { [Op.like]: `%${search}%` } },
        { customerEmail: { [Op.like]: `%${search}%` } },
      ];
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'orderItems', // ✅ match alias from Order.hasMany
           required: false, // ← prevent crash if order has no items
          include: [
            {
              model: Product,
              as: 'product', // ✅ match alias from OrderItem.belongsTo
              required: false, // ← prevent crash if orderItem has no product
            },
          ],
        },
      ],
      order: [['orderDate', 'DESC']],
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching delivered orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders by status',
      error: error.message,
    });
  }
};



exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update({ orderStatus: status });
    if (status === 'Success') await exports.generateInvoiceOnOrderComplete(order.id);

    res.json({ message: 'Order updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};
