const razorpay = require('../config/rayzorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const generateInvoiceAndSend = require('../utils/invoice'); // Your invoice function




exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }
};





exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      customerDetails,
      summary,
      address,
    } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = hmac.digest('hex');

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Create order in DB
    const order = await Order.create({
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      customerMobile: customerDetails.mobile,
      paymentMethod: "Razorpay",
      amount: summary.subtotal,
      paymentStatus: "Success",
      orderStatus: "Pending",
      orderDate: new Date(),
      address,
      subtotal: summary.subtotal,
      tax: summary.tax,
      shippingRate: summary.shipping,
      discount: summary.discount,
      grandTotal: summary.total,
    });

    // Insert Order Items
    for (let item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      });
    }

    // Include products for invoice
    const orderWithItems = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: [Product] }]
    });

    // Send invoice
    await generateInvoiceAndSend(orderWithItems);

    res.status(200).json({ success: true, message: "Payment verified and order placed" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

