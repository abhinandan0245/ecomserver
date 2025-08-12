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
    size: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    qtyPrice: { // 🆕 added field
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
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
