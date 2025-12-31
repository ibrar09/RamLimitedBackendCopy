import { ProductImage } from "../models/index.js";

export const createProductImage = async (data) => {
  return await ProductImage.create(data);
};

export const getAllProductImages = async () => {
  return await ProductImage.findAll();
};

export const getProductImagesByProductId = async (productId) => {
  return await ProductImage.findAll({ where: { product_id: productId } });
};

export const updateProductImage = async (id, data) => {
  const image = await ProductImage.findByPk(id);
  if (!image) throw new Error("Product image not found");
  return await image.update(data);
};

export const deleteProductImage = async (id) => {
  const image = await ProductImage.findByPk(id);
  if (!image) throw new Error("Product image not found");
  await image.destroy();
  return true;
};
