// models/Wishlist.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Wishlist extends Model {
  static associate(models) {
    Wishlist.belongsTo(models.Customer, { foreignKey: 'customerId' });
    Wishlist.belongsTo(models.Product, { foreignKey: 'productId' });
  }
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Wishlist',
    tableName: 'wishlists',
    timestamps: true,
  }
);

module.exports = Wishlist;
