import { ProductDetail, Product } from "../models/index.js";

// Create Product Detail
export const createProductDetail = async (data) => {
  const detail = await ProductDetail.create(data);
  return detail;
};

// Get all product details with associated product
export const getAllProductDetails = async () => {
  const details = await ProductDetail.findAll({
    include: [
      {
        model: Product,
        as: "product", // <-- must match your association alias
        attributes: ["id", "name", "price", "stock"],
      },
    ],
  });
  return details;
};

// Get product detail by ID with product
export const getProductDetailById = async (id) => {
  const detail = await ProductDetail.findByPk(id, {
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "name", "price", "stock"],
      },
    ],
  });
  if (!detail) throw new Error("Product detail not found");
  return detail;
};

// Update product detail
export const updateProductDetail = async (id, data) => {
  const detail = await ProductDetail.findByPk(id);
  if (!detail) throw new Error("Product detail not found");
  await detail.update(data);
  return detail;
};

// Delete product detail
export const deleteProductDetail = async (id) => {
  const detail = await ProductDetail.findByPk(id);
  if (!detail) throw new Error("Product detail not found");
  await detail.destroy();
  return { message: "Product detail deleted" };
};
