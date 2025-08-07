// models/PaymentMethod.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class PaymentMethod extends Model {}

PaymentMethod.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'Disable'),
    defaultValue: 'Active',
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'PaymentMethod',
  tableName: 'payment_methods',
  timestamps: true,
});

module.exports = PaymentMethod;
