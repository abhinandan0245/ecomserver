// models/InvoiceSettings.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class InvoiceSettings extends Model {}

InvoiceSettings.init({
  selectedTemplate: {
    type: DataTypes.ENUM('template1', 'template2'),
    allowNull: false,
    defaultValue: 'template1',
  },
  taxName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  taxRate: {
    type: DataTypes.FLOAT, // Use DOUBLE if more precision is needed
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'InvoiceSettings',
  tableName: 'invoice_settings',
  timestamps: false,
});

module.exports = InvoiceSettings;
