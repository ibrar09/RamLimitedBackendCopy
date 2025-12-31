// models/ProductReview.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProductReview = sequelize.define(
    "ProductReview",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      review_text: {
        type: DataTypes.TEXT,
      },
      reviewer_type: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending", // approved, pending, rejected
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
      tableName: "product_reviews",
      timestamps: false,
    }
  );

  return ProductReview;
};
