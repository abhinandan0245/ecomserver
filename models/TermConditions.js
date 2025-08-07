const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class TermConditions extends Model {}

TermConditions.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // ✅ counts as 1 key
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'TermConditions',
  tableName: 'term_conditions',
  timestamps: true,
});

module.exports = TermConditions;
