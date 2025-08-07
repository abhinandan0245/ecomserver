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
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery', 'Razorpay'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('success', 'pending', 'failed'),
    allowNull: false,
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
