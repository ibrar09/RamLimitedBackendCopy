// src/models/ProjectInvestment.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProjectInvestment = sequelize.define(
    "ProjectInvestment",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.NUMERIC }, // use numeric without commas
      currency: { type: DataTypes.STRING },
      cta_text: { type: DataTypes.STRING  },
    },
    {
      tableName: "project_investments",
      timestamps: false,
    }
  );

  return ProjectInvestment;
};
