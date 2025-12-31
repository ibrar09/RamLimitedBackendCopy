import { DataTypes } from "sequelize";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

export default (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      // Required English fields
      name: { type: DataTypes.STRING, allowNull: false }, // REQUIRED
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // REQUIRED

      // Optional English fields
      description: { type: DataTypes.TEXT, allowNull: true },
      oldprice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      sku: { type: DataTypes.STRING, unique: true, allowNull: true },
      stock: { type: DataTypes.INTEGER, defaultValue: 0 },
      category_id: { type: DataTypes.INTEGER, allowNull: true },
      brand_id: { type: DataTypes.INTEGER, allowNull: true },
      subcategory: { type: DataTypes.STRING, allowNull: true },
      image_urls: { type: DataTypes.TEXT, allowNull: false, defaultValue: "[]" },
      key_features: { type: DataTypes.TEXT, allowNull: false, defaultValue: "[]" },
      is_new_release: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_best_seller: { type: DataTypes.BOOLEAN, defaultValue: false },
      is_hot_deal: { type: DataTypes.BOOLEAN, defaultValue: false },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },

      // ALL Arabic fields are OPTIONAL (allowNull: true)
      name_ar: { type: DataTypes.STRING, allowNull: true },
      description_ar: { type: DataTypes.TEXT, allowNull: true },
      subcategory_ar: { type: DataTypes.STRING, allowNull: true },
      key_features_ar: { type: DataTypes.TEXT, allowNull: true, defaultValue: "[]" },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "products",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: async (product) => {
          if (!product.sku) {
            const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            product.sku = `SKU-${dateCode}-${nanoid()}`;
          }
        },
      },
    }
  );

  return Product;
};
