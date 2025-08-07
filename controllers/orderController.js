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



// ✅ Updated Order Controller with Razorpay Order Placement Handling

const moment = require('moment');
const json2csv = require('json2csv').parse;
const PDFDocument = require('pdfkit');  
const fs = require('fs');
const path = require('path');
const { Op} = require('sequelize');
const User = require('../models/User');
const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const InvoiceSettings = require('../models/InvoiceSettings');
const sendInvoiceEmail = require('../utils/emailSender');
const Customer = require('../models/Customer');
const razorpay = require('../config/rayzorpay');
const Transaction = require('../models/Transaction');
// const { Order, OrderItem, Product } = require('../models');

const generateOrderId = () => Math.floor(100000 + Math.random() * 900000);
const generateInvoiceNumber = async () => `INV-${Date.now()}`;

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Customer.findByPk(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    let {
      products,
      address,
      paymentMethod,
      tax = 0,
      shippingRate = 0,
      discount = 0,
      razorpayPaymentId,
      razorpayOrderId
    } = req.body;

    // Validate required fields
    if (!products || !address || !paymentMethod) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    // Additional validation for Razorpay payments
    if (paymentMethod === 'Razorpay') {
      if (!razorpayPaymentId || !razorpayOrderId) {
        return res.status(400).json({ 
          msg: 'Razorpay payment ID and order ID are required' 
        });
      }

      // Verify payment with Razorpay
      try {
        const payment = await razorpay.payments.fetch(razorpayPaymentId);
        
        if (payment.order_id !== razorpayOrderId || payment.status !== 'captured') {
          return res.status(400).json({ 
            msg: 'Payment verification failed' 
          });
        }
      } catch (err) {
        console.error('Razorpay verification error:', err);
        return res.status(400).json({ 
          msg: 'Could not verify payment with Razorpay' 
        });
      }
    }

    // Process address
    if (typeof address !== 'string') {
      address = JSON.stringify(address);
    }

    // Calculate order totals
    const productsArray = typeof products === 'string' ? JSON.parse(products) : products;
    const subtotal = productsArray.reduce(
      (sum, item) => sum + item.price * (item.qty ?? item.quantity ?? 1),
      0
    );
    const discountAmount = subtotal * (Number(discount) / 100);
    const afterDiscount = subtotal - discountAmount;
    const totalBeforeTax = afterDiscount + Number(shippingRate);
    const taxAmount = totalBeforeTax * (Number(tax) / 100);
    const grandTotal = totalBeforeTax + taxAmount;

    // Determine payment status
    const finalPaymentStatus = paymentMethod === 'Cash on Delivery' 
      ? 'Pending' 
      : 'Success'; // Only Success if we got here for Razorpay

    // Create the order
    const order = await Order.create({
      orderId: generateOrderId(),
      razorpayOrderId: paymentMethod === 'Razorpay' ? razorpayOrderId : null,
      razorpayPaymentId: paymentMethod === 'Razorpay' ? razorpayPaymentId : null,
      customerName: user.name,
      customerEmail: user.email,
      customerMobile: user.mobile || '',
      paymentMethod,
      amount: subtotal,
      paymentStatus: finalPaymentStatus,
      orderStatus: 'Pending',
      orderDate: new Date(),
      address,
      subtotal,
      tax: taxAmount,
      shippingRate,
      discount: discountAmount,
      grandTotal,
    });

    // Create order items
    for (const item of productsArray) {
      const quantity = item.qty ?? item.quantity ?? 1;
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity,
        price: item.price,
        total: quantity * item.price,
      });
    }

if (finalPaymentStatus === 'Success') {
  // ✅ Create Transaction
  await Transaction.create({
    orderId: order.orderId,
    customerName: user.name,
    paymentMethod,
    amount: grandTotal,
    status: 'success',
    date: new Date(),
  });

  // ✅ Generate Invoice
  await exports.generateInvoiceOnOrderComplete(order.id);
}

    res.status(201).json({ msg: 'Order created successfully', order });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};


exports.generateInvoiceOnOrderComplete = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order || order.paymentStatus !== 'Success') {
      console.warn(`Order not found or payment not successful: ${orderId}`);
      return;
    }

    const settings = await InvoiceSettings.findOne() || {
      selectedTemplate: 'template1',
      taxName: 'GST',
      taxRate: 0,
    };

    const invoiceNumber = await generateInvoiceNumber();

    await Invoice.create({
      orderId,
      invoiceNumber,
      template: settings.selectedTemplate,
      generatedAt: new Date(),
    });

    const invoiceDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const pdfPath = path.join(invoiceDir, `${invoiceNumber}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Invoice Number: ${invoiceNumber}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Customer: ${order.customerName}`);
    doc.text(`Email: ${order.customerEmail}`);
    doc.text(`Mobile: ${order.customerMobile}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Order ID: ${order.orderId}`);
    doc.moveDown();
    doc.text(`Tax: ${settings.taxName || 'N/A'} - ${settings.taxRate || 0}%`);
    doc.moveDown();

    const items = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product, as: 'product' }]
    });

    doc.fontSize(16).text('Order Items:', { underline: true });

    let totalAmount = 0;
    items.forEach((item, index) => {
      const title = item.product?.title || 'Unnamed Product';
      const quantity = item.quantity;
      const price = item.price;
      const lineTotal = quantity * price;
      totalAmount += lineTotal;
      doc.fontSize(12).text(
        `${index + 1}. ${title} x ${quantity} - ₹${price} (Total: ₹${lineTotal})`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Amount: ₹${totalAmount}`, { align: 'right' });
    doc.end();

    await new Promise((resolve, reject) => {
      doc.on('end', resolve);
      doc.on('error', reject);
    });

    await sendInvoiceEmail(order.customerEmail, pdfPath, invoiceNumber);
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
