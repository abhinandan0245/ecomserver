// models/Slug.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Slug extends Model {}

Slug.init({
  id: { // Added 'id' as primary key
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  slug: { // Renamed from 'name' to 'slug'
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Slugs should be unique
    // validate: {
    //   notEmpty: { msg: 'Slug is required' },
    //   len: {
    //     args: [1, 255],
    //     msg: 'Slug must be between 1 and 255 characters',
    //   },
    // },
    // set(value) {
    //   // Normalize slug before saving
    //   this.setDataValue('slug', value.trim().toLowerCase());
    // }
  },
}, {
  sequelize,
  modelName: 'Slug',
  tableName: 'slugs',
  timestamps: true, // Changed from 'false' to 'true' to include createdAt and updatedAt
});

module.exports = Slug;