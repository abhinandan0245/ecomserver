const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Customer extends Model {}

Customer.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name cannot be empty' },
    },
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Invalid email format' },
      notEmpty: { msg: 'Email is required' },
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [10, 15],
        msg: 'Mobile number should be 10-15 digits',
      },
    },
  },

  profileImage: {
    type: DataTypes.STRING,
    defaultValue: '',
  },

  // Address
  billingAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pinCode: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
       is: {
      args: /^\d{4,10}$/,
      msg: "Pin code should be between 4 to 10 digits"
    },
    is: {
      args: /^\d+$/i,
      msg: "Pin code should only contain digits"
    }
    },
  },  

  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    defaultValue: 'Active',
  },

}, {
  sequelize,
  modelName: 'Customer',
  tableName: 'customers',
  timestamps: true,
});

module.exports = Customer;
