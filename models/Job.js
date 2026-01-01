// models/Job.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Job = sequelize.define(
        "Job",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            // Store title as JSON for bilingual support { en: "...", ar: "..." }
            title: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            // Store description as JSON { en: "...", ar: "..." }
            description: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            // Store location as JSON { en: "Riyadh", ar: "الرياض" }
            location: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            // e.g. Full Time, Part Time (can be JSON if needed, or just English key)
            type: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: { en: "Full Time", ar: "دوام كامل" }
            },
            // Array of requirements strings (or JSON structure)
            requirements: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: []
            },
            status: {
                type: DataTypes.ENUM("active", "closed", "draft"),
                defaultValue: "active",
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "jobs",
            timestamps: true, // adds createdAt and updatedAt
            underscored: true,
        }
    );

    return Job;
};
