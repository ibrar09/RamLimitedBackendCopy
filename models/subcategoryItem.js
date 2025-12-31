// models/subcategoryItem.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SubcategoryItem = sequelize.define(
    "SubcategoryItem",
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
      subcategoryId: { // JS-friendly name
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "subcategoryid", // actual column in DB
        references: {
          model: "subcategories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "subcategory_items",
      timestamps: false,
    }
  );

  return SubcategoryItem;
};
