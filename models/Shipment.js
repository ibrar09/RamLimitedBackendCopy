// models/Shipment.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Shipment = sequelize.define(
    "Shipment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      // 🔥 Needed to link shipment to order
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 🔥 Needed so user can track their own shipments
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      tracking_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      courier_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      shipped_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      delivery_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // 🔥 Upgraded to ENUM for safety
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      admin_comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "shipments",
      timestamps: false, // You are using created_at manually
    }
  );

  return Shipment;
};
