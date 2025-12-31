// models/ProjectTestimonial.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProjectTestimonial = sequelize.define(
    "ProjectTestimonial",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
      },
      title: {
        type: DataTypes.STRING(100),
      },
      company: {
        type: DataTypes.STRING(100),
      },
      quote: {
        type: DataTypes.TEXT,
      },
      rating: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "project_testimonials",
      freezeTableName: true,
      timestamps: false, // ❌ Disable timestamps
      underscored: true,
    }
  );

  return ProjectTestimonial;
};
