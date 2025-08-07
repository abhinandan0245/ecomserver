const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Category extends Model {
  static associate(models) {
    // Category has many Products
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products',
    });
    // Category has many Brands
    Category.hasMany(models.Brand, {
      foreignKey: 'categoryId',
      as: 'brands',
    });
  }
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Category name cannot be empty' },
      },
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Slug cannot be empty' },
      },
    },
    size: {
      type: DataTypes.JSON, // Store multiple sizes like ["S", "M", "L"]
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
  }
);

module.exports = Category;