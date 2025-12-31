import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProjectImage = sequelize.define("ProjectImage", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return ProjectImage;
};
