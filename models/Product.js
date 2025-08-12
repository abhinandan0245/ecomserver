// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// class Product extends Model {
//   static associate(models) {
//     // Product belongs to Category
//     Product.belongsTo(models.Category, {
//       foreignKey: 'categoryId',
//       as: 'category',
//     });
//     // Product has many ImageVariants
//     Product.hasMany(models.ImageVariant, {
//       foreignKey: 'productId',
//       as: 'imageVariants',
//       onDelete: 'CASCADE',
//     });
    
//      // Add this:
//     Product.hasOne(models.Inventory, {
//       foreignKey: 'productId',
//       as: 'inventory',
//       onDelete: 'CASCADE',
//     });
//     // Add relation to coupons
//     Product.belongsToMany(models.Coupon, {
//       through: 'CouponProducts',
//       foreignKey: 'productId',
//       otherKey: 'couponId',
//       as: 'Coupons', // ✅ This must match your include alias
//     });
//      // ✅ New relation
//     Product.hasMany(models.OrderItem, {
//       foreignKey: 'productId',
//       as: 'orderItems',
//     });

//   }
// }

// Product.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     productId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     title: DataTypes.STRING,
//     hsnCode: DataTypes.STRING,
//     description: DataTypes.TEXT,
//     stock: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//     price: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//     },
//     originalPrice: { // Add this field for before discount price
//   type: DataTypes.FLOAT,
//   defaultValue: 0,
// },
// priceVariants: {
//   type: DataTypes.JSON, // e.g. [{ size: 'S', price: 100 }, { size: 'M', price: 120 }]
//   defaultValue: [],
// },
//     discount: {
//       type: DataTypes.FLOAT,
//       defaultValue: 0,
//     },
//     categoryId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'categories',
//         key: 'id',
//       },
//     },
//     brand: DataTypes.STRING,
//     // size: DataTypes.JSON,
//     sizes: {
//       type: DataTypes.JSON, // Will store selected sizes like ["S", "M"]
//       defaultValue: [],
//     },
//     color: DataTypes.JSON,
//     tags: DataTypes.JSON,
//      status: {
//       type: DataTypes.ENUM('in-stock', 'out-of-stock'),
//       defaultValue: 'in-stock',
//     },
//     productStatus: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//   },
//   {
//     sequelize,
//     modelName: 'Product',
//     tableName: 'products',
//     timestamps: true,
//   }
// );

// module.exports = Product;

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Product extends Model {
  static associate(models) {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    Product.hasMany(models.ImageVariant, {
      foreignKey: 'productId',
      as: 'imageVariants',
      onDelete: 'CASCADE',
    });
    Product.hasOne(models.Inventory, {
      foreignKey: 'productId',
      as: 'inventory',
      onDelete: 'CASCADE',
    });
    Product.belongsToMany(models.Coupon, {
      through: 'CouponProducts',
      foreignKey: 'productId',
      otherKey: 'couponId',
      as: 'Coupons',
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: 'productId',
      as: 'orderItems',
    });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: DataTypes.STRING,
    hsnCode: DataTypes.STRING,
    description: DataTypes.TEXT,
    ingredients: DataTypes.TEXT,
    additionalInfo: DataTypes.TEXT,
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    originalPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    discountPercentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
   
    priceVariants: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    sizes: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    brand: DataTypes.STRING,
    color: DataTypes.JSON,
    tags: DataTypes.JSON,
    status: {
      type: DataTypes.ENUM('in-stock', 'out-of-stock'),
      defaultValue: 'in-stock',
    },
    productStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    // hooks: {
    //   beforeSave: (product) => {
    //     // Ensure price is never negative
    //     if (product.price < 0) product.price = 0;
        
    //     // Calculate final price before saving
    //     if (product.changed('price') || product.changed('discountPercentage') || product.changed('discountAmount')) {
    //       const percentageDiscount = product.price * (product.discountPercentage / 100);
    //       const totalDiscount = percentageDiscount + product.discountAmount;
    //       product.price = Math.max(0, product.price - totalDiscount);
    //     }
    //   }
    // }

    hooks: {
  beforeSave: (product) => {
    const { originalPrice, discountPercentage, discountAmount } = product;

    let discount = 0;
    if (discountPercentage && discountPercentage > 0) {
      discount = originalPrice * (discountPercentage / 100);
    } else if (discountAmount && discountAmount > 0) {
      discount = discountAmount;
    }

    product.price = Math.max(0, originalPrice - discount);
  }
}


  }
);

module.exports = Product;