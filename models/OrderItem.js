// models/OrderItem.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class OrderItem extends Model {
  static associate(models) {
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });

    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });

    
  }
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Product Title",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    productDiscount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    originalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    selectedSize: {
      type: DataTypes.STRING,
    },
    imageUrls: {
      type: DataTypes.JSON, // multiple images
      allowNull: true,
      defaultValue: [],
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: true,
  }
);

module.exports = OrderItem;
