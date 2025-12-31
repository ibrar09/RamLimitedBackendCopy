import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Quotation = sequelize.define(
    "Quotation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      service_required: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      project_type: {
        type: DataTypes.STRING,
      },
      estimated_area: {
        type: DataTypes.STRING,
      },
      preferred_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      project_details: {
        type: DataTypes.TEXT,
      },
      pdf_path: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },

      // ✅ add this
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "quotations",
      timestamps: false,
    }
  );

  return Quotation;
};
