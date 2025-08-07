// models/PrivacyPolicy.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class PrivacyPolicy extends Model {}

PrivacyPolicy.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'PrivacyPolicy',
  tableName: 'privacy_policies',
  timestamps: true,
});

module.exports = PrivacyPolicy;
