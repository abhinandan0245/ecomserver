const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class ImageVariant extends Model {
  static associate(models) {
    ImageVariant.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
      onDelete: 'CASCADE',
    });
  }
}

ImageVariant.init({
  productId: {
  type: DataTypes.INTEGER, // matches Product.id
  allowNull: false,
  references: {
    model: 'products',
    key: 'id',
  },
},

  imageUrl: {
  type: DataTypes.STRING,
  allowNull: false,
 
},
  color: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'ImageVariant',
  tableName: 'image_variants',
  timestamps: true,
});

module.exports = ImageVariant;