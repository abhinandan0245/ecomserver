// models/Invoice.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Invoice extends Model {
  static associate(models) {
    Invoice.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
  }
}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  // Foreign key reference to orders table (internal DB id)
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },

  // Business order number for display (ORD-xxxx etc.)
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  billingAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  items: {
    type: DataTypes.JSON, // [{ title, quantity, price, total }]
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tax: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  shipping: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  generatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'Invoice',
  tableName: 'invoices',
  timestamps: false,
});

module.exports = Invoice;
