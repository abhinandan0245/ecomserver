const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class ShippingModel extends Model {}

ShippingModel.init({
  zoneName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Standard', 'Express', 'Overnight'),
    allowNull: false,
  },
  methodName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estimatedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ShippingModel',
  tableName: 'shipping_models',
  timestamps: true,
});

module.exports = ShippingModel;
