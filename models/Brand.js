const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // DB instance

class Brand extends Model {}

Brand.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  description: {
    type: DataTypes.STRING,
  },
  totalProduct: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
  categoryId: { // <-- Add this field
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'Brand',
  timestamps: true,
  tableName: 'brands',
});

module.exports = Brand;