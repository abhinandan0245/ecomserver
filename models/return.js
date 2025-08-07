const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ReturnRequest = sequelize.define('ReturnRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // ✅ 1 key
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id',
    },
    onDelete: 'CASCADE', // ✅ 1 key for FK
  },
  customerName: {
    type: DataTypes.STRING,
  },
  customerEmail: {
    type: DataTypes.STRING,
  },
  customerMobile: {
    type: DataTypes.STRING,
  },
  productName: {
    type: DataTypes.STRING,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // optionally add FK if needed
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deliveredDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  requestedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending',
  },
}, {
  timestamps: true,
  modelName: 'ReturnRequest',
  tableName: 'ReturnRequests',
});

module.exports = ReturnRequest;
