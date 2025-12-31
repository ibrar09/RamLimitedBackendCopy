import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "UserAddress",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      full_name: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING },
      address_line1: { type: DataTypes.STRING, allowNull: true},
      address_line2: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      postal_code: { type: DataTypes.STRING },
      country: { type: DataTypes.STRING },
      is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
      createdAt: { type: DataTypes.DATE, field: "created_at", defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, field: "updated_at", defaultValue: DataTypes.NOW },
    },
    {
      tableName: "user_addresses",
      timestamps: true,
    }
  );
};
