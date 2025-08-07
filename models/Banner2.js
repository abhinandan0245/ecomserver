const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Banner2 extends Model {}

Banner2.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title is required',
        },
      },
    },
    description: {
      type: DataTypes.TEXT, // Allows longer text
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required',
        },
      },
    },
    homepageImage: {
      type: DataTypes.STRING,
      allowNull: false,      
    },
    
    linkUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'Link URL must be valid',
        },
      },
    },
    
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Banner2',
    tableName: 'banners2', // lowercase and plural for SQL convention
    timestamps: true,
  }
);

module.exports = Banner2;
