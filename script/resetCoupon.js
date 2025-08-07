const sequelize = require('../config/db'); // adjust if your DB file is elsewhere
const Coupon = require('../models/Coupon');

(async () => {
  try {
    await Coupon.destroy({ where: {}, truncate: true });
    console.log('✅ Coupon table reset successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error resetting Coupon table:', err.message);
    process.exit(1);
  }
})();
