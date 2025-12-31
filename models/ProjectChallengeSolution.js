import { DataTypes } from "sequelize";


export default (sequelize)  =>{
    const ProjectChallengeSolution = sequelize.define("ProjectChallengeSolution", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
  },
  iconBgColor: {
    type: DataTypes.STRING,
  },
  iconTextColor: {
    type: DataTypes.STRING,
  },
});}


