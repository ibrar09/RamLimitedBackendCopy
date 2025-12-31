// models/Payment.js
import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_reference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.STRING, // e.g., "paypal", "card", "stripe"
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING, // "pending", "successful", "failed", "refunded"
        defaultValue: "pending",
      },
      transaction_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      gateway_response: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

    },
    {
      tableName: "payments",
      timestamps: false,
    }
  );

  return Payment;
};
