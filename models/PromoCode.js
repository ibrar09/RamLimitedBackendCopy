import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define(
        "PromoCode",
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            code: { type: DataTypes.STRING, allowNull: false, unique: true }, // e.g., "SAVE20"
            discount_type: { type: DataTypes.ENUM("percentage", "fixed"), allowNull: false }, // percentage or fixed amount
            discount_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // 20 for 20% or 50 for 50 SAR
            min_purchase: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }, // Minimum purchase amount
            max_discount: { type: DataTypes.DECIMAL(10, 2), allowNull: true }, // Max discount for percentage codes
            usage_limit: { type: DataTypes.INTEGER, allowNull: true }, // Total times code can be used
            used_count: { type: DataTypes.INTEGER, defaultValue: 0 }, // Times code has been used
            valid_from: { type: DataTypes.DATE, allowNull: false },
            valid_until: { type: DataTypes.DATE, allowNull: false },
            is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
            description: { type: DataTypes.STRING, allowNull: true }, // e.g., "20% off on all orders"
        },
        {
            tableName: "promo_codes",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );
};
