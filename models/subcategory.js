// models/subcategory.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Subcategory = sequelize.define(
    "Subcategory",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      name_ar: { type: DataTypes.STRING, allowNull: true }, // Arabic name
      categoryid: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, defaultValue: "active" },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "subcategories",
      timestamps: false,
    }
  );
  return Subcategory;
};
