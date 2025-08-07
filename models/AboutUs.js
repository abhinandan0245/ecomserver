// const mongoose = require('mongoose');
// const aboutUsSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     // required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     // required: true, optional if you want to allow About Us without an image
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('AboutUs', aboutUsSchema);
// // This code defines a Mongoose schema for an "About Us" model, which includes fields for title, content, image, and an active status. The schema also includes timestamps for creation and updates. The model is then exported for use in other parts of the application. This allows you to manage the "About Us" section of your application effectively.


const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class AboutUs extends Model {}

AboutUs.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Title must be under 255 characters',
        },
      },
    },
    content: {
      type: DataTypes.TEXT, // Better for long descriptions
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Content is required',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Image must be a valid URL',
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'AboutUs',
    tableName: 'about_us', // use lowercase with underscores for consistency
    timestamps: true,
  }
);

module.exports = AboutUs;


