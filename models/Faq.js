const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Your Sequelize instance

class Faq extends Model {}

Faq.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING(2000),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  sequelize,
  modelName: 'Faq',
  tableName: 'faqs',
  timestamps: true, // createdAt and updatedAt
});

module.exports = Faq;
