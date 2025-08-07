const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Banner3 extends Model {}

Banner3.init(
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
    heading: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Heading is required',
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
    homepageImage2: {
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
    modelName: 'Banner3',
    tableName: 'banners3', // lowercase and plural for SQL convention
    timestamps: true,
  }
);

module.exports = Banner3;
