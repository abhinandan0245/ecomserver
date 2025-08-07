const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Shipping extends Model {
  static associate(models) {
    // Now this is safe, since Sequelize loads all models before calling associate()
    Shipping.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'order',
    });
  }
}

Shipping.init({
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  shippingProvider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estimatedDeliveryDate: {
    type: DataTypes.DATE,
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
  },
  shippingStatus: {
    type: DataTypes.ENUM('Pending', 'Shipped', 'In Transit', 'Delivered', 'Failed'),
    defaultValue: 'Pending',
  },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Shipping',
  tableName: 'shippings',
  timestamps: true,
});

module.exports = Shipping;
