

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class WhyShop extends Model {}

WhyShop.init({
  //  icon: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  //   comment: 'Icon URL or class name (e.g. fa-tree or /uploads/icon.png)'
  // },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'WhyShop',
  tableName: 'whyshops',
  timestamps: true,
  
});

module.exports = WhyShop;

