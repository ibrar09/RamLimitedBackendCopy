import { DataTypes } from "sequelize";

const ProductVariantModel = (sequelize) => {
  return sequelize.define("ProductVariant", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    variant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variant_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    additional_price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sku: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "product_variants",
    timestamps: false,
  });
};

export default ProductVariantModel;
