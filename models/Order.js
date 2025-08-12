const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {
  static associate(models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'orderItems',
      onDelete: 'CASCADE',
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
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
 
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  customerMobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMethod: {
  type: DataTypes.ENUM('Razorpay', 'Debit Card', 'Credit Card', 'UPI', 'Cash on Delivery'),
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
  type: DataTypes.ENUM('Pending', 'Success', 'Failed'),
  allowNull: false,
  defaultValue: 'Pending',  
},
orderStatus: {
  type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Failed'),
  allowNull: false,
  defaultValue: 'Pending',
},
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
 
 address: {
  type: DataTypes.TEXT, // or LONGTEXT
  allowNull: false,
  get() {
    const rawValue = this.getDataValue('address');
    try {
      return JSON.parse(rawValue);
    } catch {
      return rawValue;
    }
  },
  set(value) {
    if (typeof value === 'object') {
      this.setDataValue('address', JSON.stringify(value));
    } else {
      this.setDataValue('address', value);
    }
  }
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
