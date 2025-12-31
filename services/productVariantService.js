import { ProductVariant } from "../models/index.js";

export const createVariant = async (data) => await ProductVariant.create(data);

export const getAllVariants = async () => await ProductVariant.findAll();

export const getVariantsByProductId = async (product_id) =>
  await ProductVariant.findAll({ where: { product_id } });

export const updateVariant = async (id, data) => {
  const variant = await ProductVariant.findByPk(id);
  if (!variant) throw new Error("Variant not found");
  return await variant.update(data);
};

export const deleteVariant = async (id) => {
  const variant = await ProductVariant.findByPk(id);
  if (!variant) throw new Error("Variant not found");
  await variant.destroy();
  return true;
};
