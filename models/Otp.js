const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Otp extends Model {}

Otp.init(
  {
    email: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: "Otp"  , tableName: 'otps',
  timestamps: true,}
);

module.exports = Otp;
