import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  return sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuidv4, // generate UUID automatically
      },
      invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
      orderId: { type: DataTypes.INTEGER, allowNull: false }, // match Order.id type
      userId: { type: DataTypes.INTEGER, allowNull: false }, // fixed type INTEGER
      billingName: { type: DataTypes.STRING, allowNull: false },
      billingEmail: { type: DataTypes.STRING },
      billingPhone: { type: DataTypes.STRING },
      billingAddress: { type: DataTypes.TEXT },
      billingCity: { type: DataTypes.STRING },
      billingCountry: { type: DataTypes.STRING },
      billingZip: { type: DataTypes.STRING },
      items: { type: DataTypes.JSONB, allowNull: false },
      subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      vatPercentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 15 },
      vatAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      shippingFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      grandTotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      currency: { type: DataTypes.STRING, defaultValue: "SAR" },
      paymentMethod: { type: DataTypes.STRING },
      paymentStatus: { type: DataTypes.STRING, allowNull: false },
      vatNumber: { type: DataTypes.STRING },
      pdfUrl: { type: DataTypes.TEXT },
    },
    {
      tableName: "invoices",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      underscored: true,
    }
  );
};
