// models/Wishlist.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Wishlist = sequelize.define(
    "Wishlist",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "wishlists",
      timestamps: false,
       createdAt: "created_at", // map Sequelize's createdAt
      updatedAt: "updated_at", // map Sequelize's updatedAt
    }
  );

  return Wishlist;
};
