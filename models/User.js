// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// class User extends Model {}

// User.init({
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     validate: {
//       notEmpty: { msg: 'Name cannot be empty' },  
//     },
//   },
  
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true, // Only define unique here!
//     // set(value) {
//     //   this.setDataValue('email', value.toLowerCase());
//     // },
//     // validate: {
//     //   isEmail: { msg: 'Invalid email format' },
//     // },
//   },

//   password: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },

//   // Extended Profile Fields
//   profileImage: {
//     type: DataTypes.STRING,
//     defaultValue: '',
//   },

//   mobile: {
//     type: DataTypes.STRING,
//   },

//   // Address
//   billingAddress: {
//     type: DataTypes.STRING,
//   },
//   shippingAddress: {
//     type: DataTypes.STRING,
//   },
//   city: {
//     type: DataTypes.STRING,
//   },
//   state: {
//     type: DataTypes.STRING,
//   },
//   country: {
//     type: DataTypes.STRING,
//   },
//   pinCode: {
//     type: DataTypes.STRING,
//   },

//   // Business Info
//   companyName: {
//     type: DataTypes.STRING,
//   },

//   businessEmail: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     // set(value) {
//     //   // Normalize and handle blank input
//     //   this.setDataValue('businessEmail', value?.trim() === '' ? null : value?.toLowerCase());
//     // },
//     // validate: {
//     //   isEmail: {
//     //     msg: 'Invalid business email',
//     //   },
//     // },
//   },

//   businessType: {
//     type: DataTypes.STRING,
//   },

//   taxId: {
//     type: DataTypes.STRING,
//   },

//   // Settings
//   pushNotification: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },

//   // Role
//   role: {
//     type: DataTypes.ENUM('admin', 'user'),
//     defaultValue: 'admin',
//   },
// }, {
//   sequelize,
//   modelName: 'User',
//   tableName: 'users',
//   timestamps: true,
//   // REMOVE the indexes array!
// });

// module.exports = User;

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init({
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
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  profileImage: {
    type: DataTypes.STRING,
    defaultValue: '',
  },

  mobile: {
    type: DataTypes.STRING,
  },

}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
