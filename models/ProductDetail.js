import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "ProductDetail",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      product_id: { type: DataTypes.INTEGER, allowNull: false },

      // ALL English fields are OPTIONAL
      // material: { type: DataTypes.STRING, allowNull: true },
      color: { type: DataTypes.STRING, allowNull: true },
      size: { type: DataTypes.STRING, allowNull: true },
      feature: { type: DataTypes.TEXT, allowNull: true },
      model_number: { type: DataTypes.STRING, allowNull: true },
      payment: { type: DataTypes.STRING, allowNull: true },
      usage: { type: DataTypes.TEXT, allowNull: true },
      delivery_time: { type: DataTypes.STRING, allowNull: true },
      note: { type: DataTypes.TEXT, allowNull: true },

      // ALL Arabic fields are OPTIONAL (allowNull: true)
      // material_ar: { type: DataTypes.STRING, allowNull: true },
      color_ar: { type: DataTypes.STRING, allowNull: true },
      size_ar: { type: DataTypes.STRING, allowNull: true },
      feature_ar: { type: DataTypes.TEXT, allowNull: true },
      payment_ar: { type: DataTypes.STRING, allowNull: true },
      usage_ar: { type: DataTypes.TEXT, allowNull: true },
      delivery_time_ar: { type: DataTypes.STRING, allowNull: true },
      note_ar: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: "product_details",
      freezeTableName: true,
      timestamps: true, // createdAt and updatedAt
    }
  );
};
