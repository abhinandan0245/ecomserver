const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Banner extends Model {}

Banner.init(
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
      validate: {
        notEmpty: {
          msg: 'Image URL is required',
        },
      },
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
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Order must be a non-negative integer',
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
    modelName: 'Banner',
    tableName: 'banners', // lowercase and plural for SQL convention
    timestamps: true,
  }
);

module.exports = Banner;
