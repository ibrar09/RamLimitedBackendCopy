import { DataTypes } from "sequelize";

export default (sequelize) => {
  const SupportTicket = sequelize.define(
    "SupportTicket",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "open",
      },
      priority: {
        type: DataTypes.STRING,
        defaultValue: "medium",
      },
    },
    {
      tableName: "support_tickets",
      timestamps: true, // Enables createdAt & updatedAt automatically
      underscored: true, // Converts camelCase -> snake_case (for consistency)
    }
  );

  return SupportTicket;
};
