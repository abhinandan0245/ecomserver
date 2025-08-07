const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./Customer');

class SupportMessage extends Model {
  static associate(models) {
    SupportMessage.belongsTo(models.Customer, {
      foreignKey: 'customerId',
    });
  }
}

SupportMessage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // ✅ 1 key
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id',
    }, // ✅ adds FK index
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Resolved'),
    allowNull: false,
    defaultValue: 'Pending',
  },
}, {
  sequelize,
  modelName: 'SupportMessage',
  tableName: 'support_messages',
  timestamps: true,
  updatedAt: false, // ✅ disables updatedAt (reduces internal field clutter)
});

module.exports = SupportMessage;
