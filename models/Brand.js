import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Brand",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      logo_url: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      status: { type: DataTypes.STRING, defaultValue: "active" },
      createdAt: { type: DataTypes.DATE, field: "created_at", defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, field: "updated_at", defaultValue: DataTypes.NOW },
    },
    {
      tableName: "brands",
      timestamps: true,
    }
  );
};
