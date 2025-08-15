// controllers/paymentCallbackController.js
const sequelize = require('../config/db');
const ccAvenue = require('../config/ccAvenue');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const Cart = require('../models/Cart');

exports.ccavenueCallback = async (req, res) => {
  // CCAvenue posts 'encResp' as x-www-form-urlencoded
  try {
    const encResp = req.body.encResp;
    if (!encResp) return res.status(400).send('Missing encResp');

    const plain = ccAvenue.decrypt(encResp);

    // Parse key=value pairs (URL-encoded format)
    const pairs = {};
    plain.split('&').forEach(kv => {
      const [k, v] = kv.split('=');
      pairs[decodeURIComponent(k)] = decodeURIComponent((v || '').replace(/\+/g, ' '));
    });

    const order_status = pairs['order_status'];          // 'Success' | 'Aborted' | 'Failure'
    const order_id = pairs['order_id'];
    const tracking_id = pairs['tracking_id'] || null;
    const payment_mode = pairs['payment_mode'] || null;
    const amount = Number(pairs['amount'] || 0);
    const merchant_param1 = pairs['merchant_param1'];    // our transactionId

    const t = await sequelize.transaction();

    const txn = await Transaction.findOne({ where: { transactionId: merchant_param1 }, transaction: t, lock: t.LOCK.UPDATE });
    if (!txn) {
      await t.rollback();
      return res.redirect(`${process.env.FRONTEND_URL}/thankyou?status=failed&reason=TXN_NOT_FOUND`);
    }

    if (order_status === 'Success') {
      // Only create order once
      const meta = JSON.parse(txn.meta || '{}');
      const { customerId, products = [], shipping = {}, totals = {} } = meta;

      const order = await Order.create({
        orderId: order_id,
        customerId,
        paymentMethod: payment_mode || 'Online',
        amount: totals.grandTotal,
        paymentStatus: 'Success',
        orderStatus: 'Processing',
        subtotal: totals.subtotal,
        tax: totals.tax,
        shippingRate: totals.shippingRate,
        discount: totals.discount,
        grandTotal: totals.grandTotal,
        shippingName: shipping.shippingName,
        shippingEmail: shipping.shippingEmail,
        shippingAddress: shipping.shippingAddress,
        shippingCity: shipping.shippingCity,
        shippingState: shipping.shippingState,
        shippingPostalCode: shipping.shippingPostalCode,
        shippingCountry: shipping.shippingCountry,
        shippingPhone: shipping.shippingPhone,
        orderDate: new Date()
      }, { transaction: t });

      // Items + stock
      for (const item of products) {
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
      }

      // Clear cart & invoice
      await Cart.destroy({ where: { customerId }, transaction: t });

      await Invoice.create({
        invoiceNumber: 'INV' + Date.now(),
        orderId: order.id,
        customerId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'paid',
        amount: totals.grandTotal,
        tax: totals.tax,
        discount: totals.discount,
        shipping: totals.shippingRate,
        total: totals.grandTotal,
      }, { transaction: t });

      await txn.update({ status: 'success', gatewayRef: tracking_id, orderId: order.orderId }, { transaction: t });

      await t.commit();
      return res.redirect(`${process.env.FRONTEND_URL}/thankyou?status=success&orderId=${encodeURIComponent(order.orderId)}`);
    }

    // Failure/Aborted
    await txn.update({ status: 'failed', gatewayRef: tracking_id }, { transaction: t });
    await t.commit();
    return res.redirect(`${process.env.FRONTEND_URL}/thankyou?status=failed&reason=${encodeURIComponent(order_status)}`);
  } catch (e) {
    console.error('CCAvenue callback error:', e);
    return res.redirect(`${process.env.FRONTEND_URL}/thankyou?status=failed&reason=SERVER_ERROR`);
  }
};
