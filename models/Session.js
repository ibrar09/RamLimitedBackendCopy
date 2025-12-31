import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Session",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      refresh_token: { type: DataTypes.TEXT, allowNull: false },
      device: { type: DataTypes.STRING, allowNull: false, defaultValue: "Unknown" },
      ip_address: { type: DataTypes.STRING, allowNull: true, field: "ip" }, // map DB ip column
      expires_at: { type: DataTypes.DATE, allowNull: false },
      valid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // optional
    },
    {
      tableName: "sessions",
      timestamps: true, // auto-manage created_at and updated_at
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
};
