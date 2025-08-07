const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Review extends Model {}

Review.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // ✅ 1 key
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
    onDelete: 'CASCADE', // ✅ creates a foreign key (1 key)
  },
  reviewerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('approved', 'pending', 'rejected'),
    defaultValue: 'pending',
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'Reviews',
  timestamps: false, // ✅ No createdAt/updatedAt — uses custom `date`
});

module.exports = Review;
