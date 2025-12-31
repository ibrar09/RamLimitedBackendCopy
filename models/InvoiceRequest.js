// backend/models/InvoiceRequest.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const InvoiceRequest = sequelize.define(
    "InvoiceRequest",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      invoiceNumber: { type: DataTypes.STRING, field: "invoice_number" },
      orderId: { type: DataTypes.INTEGER, allowNull: false, field: "order_id" },

      userId: { type: DataTypes.INTEGER, allowNull: false, field: "user_id" },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending"
      },
      pdfPath: { type: DataTypes.STRING, field: "pdf_path" },
      requestedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: "requested_at" },
      sentAt: { type: DataTypes.DATE, field: "sent_at" },
    },
    {
      tableName: "invoice_requests",
      timestamps: true,
      createdAt: "requested_at",  // maps createdAt to requested_at
      updatedAt: false,           // no updatedAt column
    }
  );

  // Associations
  InvoiceRequest.associate = (models) => {
    InvoiceRequest.belongsTo(models.User, { foreignKey: "user_id", as: "User" });
    InvoiceRequest.belongsTo(models.Order, { foreignKey: "order_id", as: "Order" });
  };

  return InvoiceRequest;
};
