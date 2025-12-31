// src/models/InvestmentFeature.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const InvestmentFeature = sequelize.define(
    "InvestmentFeature",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      investment_id: { type: DataTypes.INTEGER, allowNull: false },
      feature: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "project_investment_features",
      timestamps: false,
    }
  );

  return InvestmentFeature;
};
