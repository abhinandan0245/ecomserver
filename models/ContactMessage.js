const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class ContactMessage extends Model {}

ContactMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ContactMessage",
    tableName: "contact_messages",
    timestamps: true, // adds createdAt, updatedAt
  }
);

module.exports = ContactMessage;
