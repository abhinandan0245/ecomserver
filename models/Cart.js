// models/Cart.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Cart extends Model {
  static associate(models) {
    Cart.belongsTo(models.Customer, { foreignKey: 'customerId' });
    Cart.belongsTo(models.Product, { foreignKey: 'productId' });
  }
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: { type: DataTypes.STRING, allowNull: true }, // 🆕 added this line
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
  }
);

module.exports = Cart;