// src/models/Project.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Project = sequelize.define(
    "Project",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      name_ar: { type: DataTypes.STRING }, // Arabic name

      category: { type: DataTypes.STRING },
      category_ar: { type: DataTypes.STRING }, // Arabic category

      client: { type: DataTypes.STRING },
      client_ar: { type: DataTypes.STRING }, // Arabic client

      year: { type: DataTypes.INTEGER },
      duration: { type: DataTypes.STRING },
      budget: { type: DataTypes.STRING },
      featured: { type: DataTypes.BOOLEAN, defaultValue: false },
      team_size: { type: DataTypes.INTEGER },
      image: { type: DataTypes.STRING },
      description: { type: DataTypes.TEXT },
      description_ar: { type: DataTypes.TEXT }, // Arabic description
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },

    },
    {
      tableName: "projects",
      timestamps: false,
    }
  );

  return Project;
};
