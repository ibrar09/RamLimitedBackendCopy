// src/models/ProjectSolution.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProjectSolution = sequelize.define(
    "ProjectSolution",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING },
      content: { type: DataTypes.TEXT },
      icon: { type: DataTypes.STRING },
      iconbgcolor: { type: DataTypes.STRING },
      icontextcolor: { type: DataTypes.STRING },
    },
    {
      tableName: "project_solutions",
      timestamps: false,
    }
  );

  return ProjectSolution;
};
