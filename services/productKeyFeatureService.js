import { ProductKeyFeature } from "../models/index.js";

export const createFeature = async (data) => await ProductKeyFeature.create(data);

export const getAllFeatures = async () => await ProductKeyFeature.findAll();

export const getFeaturesByProductId = async (product_id) =>
  await ProductKeyFeature.findAll({ where: { product_id } });

export const updateFeature = async (id, data) => {
  const feature = await ProductKeyFeature.findByPk(id);
  if (!feature) throw new Error("Feature not found");
  return await feature.update(data);
};

export const deleteFeature = async (id) => {
  const feature = await ProductKeyFeature.findByPk(id);
  if (!feature) throw new Error("Feature not found");
  await feature.destroy();
  return true;
};
