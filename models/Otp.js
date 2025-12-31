import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Otp = sequelize.define(
    "Otp",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
      email: { type: DataTypes.STRING, allowNull: false },
      otp: { type: DataTypes.STRING(6), allowNull: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false, field: "expires_at" },
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      purpose: { type: DataTypes.STRING, defaultValue: "verification" }, // ✅ add this
    },
    {
      tableName: "otps",
      timestamps: true,
      underscored: true,
    }
  );

  return Otp;
};
