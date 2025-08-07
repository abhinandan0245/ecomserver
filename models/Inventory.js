const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Inventory extends Model {
  static associate(models) {
    Inventory.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
      onDelete: 'CASCADE',
    });
  }
}

Inventory.init({
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products', // Should match your Product table name
      key: 'id',
    },
  },
  productName: DataTypes.STRING,
  stockAvailable: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('in-stock', 'out-of-stock'),
    defaultValue: 'in-stock',
  },
  status: {
    type: DataTypes.ENUM('in-stock', 'out-of-stock'),
    defaultValue: 'in-stock',
  },
  productStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
}, {
  sequelize,
  modelName: 'Inventory',
  tableName: 'inventories',
  timestamps: true,
});

module.exports = Inventory;