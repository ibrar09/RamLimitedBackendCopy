import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Category",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      name_ar: { type: DataTypes.STRING, allowNull: true }, // Arabic name
      description: { type: DataTypes.TEXT },
      description_ar: { type: DataTypes.TEXT, allowNull: true }, // Arabic description
      parent_id: { type: DataTypes.INTEGER },
      slug: { type: DataTypes.STRING, unique: true },
      image_url: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING, defaultValue: "active" },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    {
      tableName: "categories",
      timestamps: false
    }
  );
};
