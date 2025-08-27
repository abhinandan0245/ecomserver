const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path if necessary

class ContactPage extends Model {}

ContactPage.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
   facebook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  snapchat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'ContactPage',
  timestamps: true,
});

module.exports = ContactPage;
