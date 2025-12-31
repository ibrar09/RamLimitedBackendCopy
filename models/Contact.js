import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Contact = sequelize.define(
    "Contact",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
      },
      serviceneeded: {
        type: DataTypes.STRING,
      },
      source: {
        type: DataTypes.STRING,
        defaultValue: "website",
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
      tableName: "contacts",
      timestamps: false,
    }
  );

  return Contact;
};
