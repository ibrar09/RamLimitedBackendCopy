import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING(100) ,allowNull:true},
      phone: { type: DataTypes.STRING },
      role: { type: DataTypes.STRING, defaultValue: "user" },
      status: { type: DataTypes.STRING, defaultValue: "active" },
      provider: { type: DataTypes.STRING, defaultValue: "local" },
      emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false, field: "emailVerified" },
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      profile_picture: { type: DataTypes.STRING },
      refresh_token: { type: DataTypes.TEXT },
      otp: { type: DataTypes.STRING(6) },
      otpExpires: { type: DataTypes.DATE, field: "otpExpires" },
    },
    {
       tableName: "users",
      timestamps: true,           // Sequelize will now manage createdAt/updatedAt
      createdAt: "created_at",    // map createdAt → created_at
      updatedAt: "updated_at",    // map updatedAt → updated_at
      underscored: true, 
    }
  );

  // Password hashing
 
  return User;
};
