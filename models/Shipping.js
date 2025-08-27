// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// class Shipping extends Model {
//   static associate(models) {
//     Shipping.belongsTo(models.Order, {
//       foreignKey: 'orderId',
//       as: 'order',
//     });
//   }
// }

// Shipping.init({
//   orderId: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'orders',
//       key: 'id'
//     }
//   },
//   shippingProvider: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     defaultValue: 'Delhivery'
//   },
//   trackingNumber: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     unique: true
//   },
//   waybillNumber: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     unique: true
//   },
//   shippedDate: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   estimatedDeliveryDate: {
//     type: DataTypes.DATE,
//   },
//   actualDeliveryDate: {
//     type: DataTypes.DATE,
//   },
//   shippingStatus: {
//     type: DataTypes.ENUM(
//       'Pending', 
//       'Processing', 
//       'Shipped', 
//       'In Transit', 
//       'Out for Delivery', 
//       'Delivered', 
//       'Failed', 
//       'Cancelled', 
//       'Returned'
//     ),
//     defaultValue: 'Pending',
//   },
//   address: {
//     type: DataTypes.JSON,
//     allowNull: false,
//   },
//   shippingCost: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: true,
//   },
//   packageDetails: {
//     type: DataTypes.JSON,
//     defaultValue: {}
//   },
//   pickupLocation: {
//     type: DataTypes.JSON,
//     defaultValue: {}
//   },
//   delhiveryResponse: {
//     type: DataTypes.JSON,
//     defaultValue: {}
//   },
//   trackingHistory: {
//     type: DataTypes.JSON,
//     defaultValue: [],
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   }
// }, {
//   sequelize,
//   modelName: 'Shipping',
//   tableName: 'shippings',
//   timestamps: true,
//   indexes: [
//     {
//       fields: ['orderId']
//     },
//     {
//       fields: ['trackingNumber']
//     },
//     {
//       fields: ['shippingStatus']
//     }
//   ]
// });

// module.exports = Shipping;



