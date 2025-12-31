import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Banner",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      subtitle: { type: DataTypes.STRING },
      image_url: { type: DataTypes.STRING, allowNull: false },
      target_type: {
        type: DataTypes.ENUM("product", "category", "custom"),
        allowNull: false,
      },
      target_value: { type: DataTypes.STRING },
      active: { type: DataTypes.BOOLEAN, defaultValue: true }, // new
      priority: { type: DataTypes.INTEGER, defaultValue: 0 },   // new
      start_date: { type: DataTypes.DATE, allowNull: true },    // new
      end_date: { type: DataTypes.DATE, allowNull: true },      // new
      createdAt: { type: DataTypes.DATE, field: "created_at", defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, field: "updated_at", defaultValue: DataTypes.NOW },
    },
    {
      tableName: "banners",
      timestamps: true,
    }
  );
};
