// models/ProductKeyFeature.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "ProductKeyFeature",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "products", key: "id" },
        onDelete: "CASCADE",
      },
      feature_name: { type: DataTypes.STRING, allowNull: false },
      feature_value: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "product_key_features",
      timestamps: true,
      
    }
  );
};
