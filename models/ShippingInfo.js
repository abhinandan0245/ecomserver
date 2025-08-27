
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class shippingInfo extends Model {}

shippingInfo.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'shippingInfo',
  tableName: 'shipping_info',
  timestamps: true,
});

module.exports = shippingInfo;
