// models/Shipment.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Shipment extends Model {
  static associate(models) {
    // Each shipment belongs to one order
    Shipment.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "order",
    });

    // Shipment belongs to a customer
    Shipment.belongsTo(models.Customer, {
      foreignKey: "customerId",
      as: "Customer",
    });

    // Shipment may have many order items
    Shipment.hasMany(models.OrderItem, {
      foreignKey: "shipmentId",
      as: "orderItems",
    });

    

  }
}

Shipment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "customers",
        key: "id",
      },
    },

    paymentId: {
      type: DataTypes.STRING, // Razorpay/CCavenue/Stripe txn id
      allowNull: true,
    },

    shipmentRef: {
      type: DataTypes.STRING, // external shipment id from Delhivery
      allowNull: true,
    },

    courier: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Delhivery",
    },

    waybill: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },

    refNo: {
      type: DataTypes.STRING, // internal reference/order number
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    //   defaultValue: "Pending",
    },

    paymentMode: {
      type: DataTypes.STRING, // Prepaid / COD
      allowNull: true,
    },

    codAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    // === Financials ===
    couponCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    appliedDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },

    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    tax: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },

    deliveryCharge: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },

    shippingCharge: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },

    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    // === Meta Data ===
    labelUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    pickupLocation: {
      type: DataTypes.JSON,
      defaultValue: {},
    },

    customerAddress: {
      type: DataTypes.JSON,
      defaultValue: {},
    },

    packageDetails: {
      type: DataTypes.JSON,
      defaultValue: {},
    },

    payloadSnapshot: {
      type: DataTypes.JSON,
      defaultValue: {},
    },

    lastTracking: {
      type: DataTypes.JSON,
      defaultValue: {},
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Shipment",
    tableName: "shipments",
    timestamps: true,
    indexes: [
      { fields: ["orderId"] },
      { fields: ["customerId"] },
      { fields: ["paymentId"] },
      { fields: ["waybill"] },
      { fields: ["status"] },
    ],
  }
);

module.exports = Shipment;