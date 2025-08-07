const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust path if necessary

class ContactPage extends Model {}

ContactPage.init({
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'ContactPage',
  timestamps: true,
});

module.exports = ContactPage;
