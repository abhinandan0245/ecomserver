const ccAvenue = require('../config/ccAvenue');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Customer = require('../models/Customer');
const generateInvoiceAndSend = require('../utils/invoice');
const Product = require('../models/Product');

exports.initiateCCAvenuePayment = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Customer.findByPk(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const {
      products,
      address,
      tax = 0,
      shippingRate = 0,
      discount = 0
    } = req.body;

    // Calculate order amounts
    const productsArray = typeof products === 'string' ? JSON.parse(products) : products;
    const subtotal = productsArray.reduce((sum, item) => sum + item.price * (item.qty ?? 1), 0);
    const discountAmount = subtotal * (Number(discount) / 100);
    const afterDiscount = subtotal - discountAmount;
    const totalBeforeTax = afterDiscount + Number(shippingRate);
    const taxAmount = totalBeforeTax * (Number(tax) / 100);
    const grandTotal = totalBeforeTax + taxAmount;

    // Create order in "Pending" state
    const order = await Order.create({
      orderId: Math.floor(100000 + Math.random() * 900000),
      customerName: user.name,
      customerEmail: user.email,
      customerMobile: user.mobile || '',
      paymentMethod: 'CC Avenue',
      amount: grandTotal,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      orderDate: new Date(),
      address: typeof address === 'string' ? address : JSON.stringify(address),
      subtotal,
      tax: taxAmount,
      shippingRate,
      discount: discountAmount,
      grandTotal,
    });

    // Create order items
    for (const item of productsArray) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.qty ?? 1,
        price: item.price,
        total: (item.qty ?? 1) * item.price,
      });
    }

    // Prepare CC Avenue request data
    const merchantData = {
      merchant_id: ccAvenue.merchantId,
      order_id: order.orderId,
      amount: grandTotal.toFixed(2),
      currency: 'INR',
      redirect_url: `${process.env.BASE_URL}/api/payment/ccavenue/callback`,
      cancel_url: `${process.env.BASE_URL}/api/payment/ccavenue/callback`,
      language: 'EN',
      billing_name: user.name,
      billing_email: user.email,
      billing_tel: user.mobile || '',
    };

    // Encrypt the merchant data
    const encryptedData = ccAvenue.encrypt(JSON.stringify(merchantData));

    res.json({
      success: true,
      paymentUrl: `${process.env.CCAVENUE_PAYMENT_URL}/transaction/transaction.do?command=initiateTransaction&encRequest=${encodeURIComponent(encryptedData)}&access_code=${ccAvenue.accessCode}`,
      orderId: order.orderId
    });

  } catch (err) {
    console.error('CC Avenue initiation error:', err);
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
};


// Add better error handling for the callback
exports.handleCCAvenueCallback = async (req, res) => {
  try {
    const encryptedResponse = req.body.encResp;
    if (!encryptedResponse) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid response from payment gateway' 
      });
    }

    // Decrypt the response
    const decryptedResponse = ccAvenue.decrypt(encryptedResponse);
    const responseData = JSON.parse(decryptedResponse);

    // Validate required fields
    if (!responseData.order_id || !responseData.order_status) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid payment response' 
      });
    }

    // Find and validate order
    const order = await Order.findOne({ 
      where: { orderId: responseData.order_id },
      include: [{ model: OrderItem, include: [Product] }]
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    // Verify payment amount
    const paidAmount = parseFloat(responseData.amount);
    if (paidAmount !== parseFloat(order.grandTotal)) {
      await order.update({ 
        paymentStatus: 'Failed', 
        orderStatus: 'Failed',
        paymentNote: 'Amount mismatch' 
      });
      
      return res.redirect(`${process.env.FRONTEND_URL}/order/failed/${order.orderId}?reason=amount_mismatch`);
    }

    // Process successful payment
    if (responseData.order_status === 'Success') {
      await order.update({
        paymentStatus: 'Success',
        orderStatus: 'Processing'
      });

      // Create transaction record
      await Transaction.create({
        orderId: order.orderId,
        customerId: order.customerId,
        paymentMethod: 'CC Avenue',
        amount: order.grandTotal,
        status: 'success',
        transactionId: responseData.tracking_id,
        date: new Date(),
      });

      // Generate invoice
      await exports.generateInvoiceOnOrderComplete(order.id);

      return res.redirect(`${process.env.FRONTEND_URL}/order/success/${order.orderId}?payment_id=${responseData.tracking_id}`);
    }

    // Handle failed payment
    await order.update({
      paymentStatus: 'Failed',
      orderStatus: 'Failed',
      paymentNote: responseData.failure_message || 'Payment failed'
    });

    return res.redirect(`${process.env.FRONTEND_URL}/order/failed/${order.orderId}?reason=payment_failed`);

  } catch (err) {
    console.error('CC Avenue callback error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Payment processing failed' 
    });
  }
};