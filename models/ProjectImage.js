// src/models/ProjectImage.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProjectImage = sequelize.define(
    "ProjectImage",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      project_id: { type: DataTypes.INTEGER, allowNull: false },
      image_url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "project_images",
      timestamps: false,
    }
  );

  return ProjectImage;
};
