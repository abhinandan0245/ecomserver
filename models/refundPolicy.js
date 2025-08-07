const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class RefundPolicy extends Model {}

RefundPolicy.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'RefundPolicy',
  tableName: 'refund_policies',
  timestamps: true,
});

module.exports = RefundPolicy;
