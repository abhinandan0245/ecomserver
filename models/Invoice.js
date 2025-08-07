const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Invoice extends Model {}

Invoice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',  // make sure 'orders' table exists
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  template: {
    type: DataTypes.ENUM('template1', 'template2'),
    defaultValue: 'template1',
  },
  generatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Invoice',
  tableName: 'invoices',
  timestamps: false,
});

module.exports = Invoice;
