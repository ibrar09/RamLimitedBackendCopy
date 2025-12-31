          // src/models/ProjectChallenge.js
          import { DataTypes } from "sequelize";

          export default (sequelize) => {
            const ProjectChallenge = sequelize.define(
              "ProjectChallenge",
              {
                id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
                project_id: { type: DataTypes.INTEGER, allowNull: false },
                title: { type: DataTypes.STRING, allowNull: false },
                content: { type: DataTypes.TEXT },
                icon: { type: DataTypes.STRING },
                iconbgcolor: { type: DataTypes.STRING },
                icontextcolor: { type: DataTypes.STRING },
              },
              {
                tableName: "project_challenges",
                timestamps: false,
              }
            );

            return ProjectChallenge;
          };
