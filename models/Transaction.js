const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Transaction extends Model {}

Transaction.init({
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => 'TXN' + Math.floor(100000 + Math.random() * 900000),
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: true, // we may not have it until payment succeeds
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING, // changed from ENUM to allow gateway values like "UPI", "Card"
    allowNull: true,
  },
  gateway: {
    type: DataTypes.STRING, // e.g., 'CCAVENUE', 'RAZORPAY'
    allowNull: false,
  },
  gatewayRef: {
    type: DataTypes.STRING, // payment gateway's transaction/order reference ID
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('initiated', 'success', 'pending', 'failed'),
    allowNull: false,
    defaultValue: 'initiated',
  },
  meta: {
    type: DataTypes.JSON, // store cart snapshot, shipping, totals
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    {
      name: 'order_status_idx',
      fields: ['orderId', 'status'],
    },
  ],
});

module.exports = Transaction;
