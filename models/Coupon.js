// models/Coupon.js
import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      discount_type: {
        type: DataTypes.STRING, // 'percentage' or 'fixed'
        allowNull: false,
      },
      discount_value: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      min_order_amount: {
        type: DataTypes.DECIMAL,
      },
      max_discount_amount: {
        type: DataTypes.DECIMAL,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      usage_limit: {
        type: DataTypes.INTEGER,
      },
      used_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING, // 'active', 'expired', 'disabled'
        defaultValue: "active",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "coupons",
      timestamps: false,
    }
  );

  return Coupon;
};
