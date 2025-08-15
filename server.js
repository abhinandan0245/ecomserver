const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load .env file
dotenv.config();



// ✅ Routes
const userRoutes = require('./routes/userRoutes');
const catRoutes = require('./routes/catRoutes');
const slugRoutes = require('./routes/slugRoutes');
const orderRoutes = require('./routes/orderRoutes');
const returnRoutes = require('./routes/returnRoutes');
const shippingRoutes = require('./routes/shippingRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const customerRoutes = require('./routes/customerRoutes');
const resetPRoutes = require('./routes/resetPRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const refundRoutes = require('./routes/refundRoutes');
const shippingManageRoutes = require('./routes/shippingManageRoutes');
const couponRoutes = require('./routes/couponRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const banner2Routes = require('./routes/banner2Routes ');
const banner3Routes = require('./routes/banner3Routes');
const whyShopRoutes = require('./routes/whyShopRoutes');
const aboutusRoutes = require('./routes/aboutusRoutes');
const contactRoutes = require('./routes/contactRoutes');
const faqRoutes = require('./routes/faqRoutes');
const termConditionRoutes = require('./routes/termConditionsRpoutes');
const privacyPolicyRoutes = require('./routes/privacyPolicyRoutes');
const refundPolicyRoutes = require('./routes/refundPolicyRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const paymentRoutes = require('./routes/payment');
// const User = require('./models/User');

// Initialize express
const app = express();

// ✅ Middleware
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL, 'http://localhost:5174'],
  // origin: ['https://admin.yoursite.com', 'https://www.yoursite.com']
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/invoices', express.static(path.join(__dirname, 'invoices')));




// ✅ Server + MySQL Sync
const PORT = process.env.PORT || 5000;

// ✅ Load Sequelize models and associations
const db = require('./models');



//  Sync DB and start server
db.sequelize.sync()    // <--- Only use sync() with no options!
  .then(() => {
    
    // API Routes
app.use('/api/user', userRoutes);
app.use('/api/category', catRoutes);
app.use('/api/slug', slugRoutes);
app.use('/api/return', returnRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/', transactionRoutes);
app.use('/api/payment-method', paymentMethodRoutes);
app.use('/api/refund', refundRoutes);
app.use('/api/shipping-manage', shippingManageRoutes);
app.use('/api', couponRoutes);
app.use('/api', bannerRoutes);
app.use('/api', banner2Routes);
app.use('/api', banner3Routes);
app.use('/api/why-shop', whyShopRoutes);
app.use('/api', aboutusRoutes);
app.use('/api', contactRoutes);
app.use('/api', faqRoutes);
app.use('/api', termConditionRoutes);
app.use('/api', privacyPolicyRoutes);
app.use('/api', refundPolicyRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api', resetPRoutes);
app.use('/api', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);


// 404 Fallback
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});


    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('MySQL DB synced via Sequelize');
    });
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err.message);
  });
