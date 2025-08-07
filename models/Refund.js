const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Refund extends Model {}

Refund.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders', // Must match table name, not class name
      key: 'id',
    },    
    onDelete: 'CASCADE',
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    defaultValue: 'Pending',
    allowNull: false,
  },
  requestedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Refund',
  tableName: 'refunds',
  timestamps: false,
});

module.exports = Refund;
