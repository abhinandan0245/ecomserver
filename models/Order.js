const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {
  static associate(models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems',
      onDelete: 'CASCADE',
    });
      Order.belongsTo(models.Customer, { foreignKey: 'customerId', as: "Customer", });

        //  Add this:
    Order.hasMany(models.Shipment, {
      foreignKey: 'orderId',
      as: 'shipments',
      onDelete: 'CASCADE',
    });
    
    Order.hasOne(models.Invoice, {
  foreignKey: "orderId",
  as: "invoice",
  onDelete: "CASCADE",
});
  }
}

Order.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
 orderId: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
},
   customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
 
  
 paymentMethod: {
  type: DataTypes.STRING,
  allowNull: false,
},

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
 paymentStatus: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: 'Pending',
},
orderStatus: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: 'Processing',
},
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  
  shippingName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingState: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingPostalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingCountry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shippingPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },


   subtotal: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false,
  defaultValue: 0.0,
},
  tax: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  shippingRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  grandTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
