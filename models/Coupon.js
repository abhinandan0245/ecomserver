// models/Coupon.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Coupon extends Model {
  static associate(models) {
    Coupon.belongsToMany(models.Product, {
      through: 'CouponProducts',
      foreignKey: 'couponId',
      otherKey: 'productId',
        as: 'products' // ADD THIS
    });
  }
}

Coupon.init({
  couponCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  minOrderValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  combineWithOtherCoupons: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  customerSegment: {
    type: DataTypes.ENUM('new', 'returning', 'all'),
    allowNull: false,
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'flat'),
    allowNull: false,
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Coupon',
  tableName: 'coupons',
  timestamps: true,
  indexes: [{ fields: ['couponCode'] }],
});

module.exports = Coupon;