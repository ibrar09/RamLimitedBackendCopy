import { Brand } from "../models/index.js";

export const createBrand = async (data) => {
  return await Brand.create(data);
};

export const getAllBrands = async () => {
  return await Brand.findAll();
};

export const getBrandById = async (id) => {
  return await Brand.findByPk(id);
};

export const updateBrand = async (id, data) => {
  const brand = await Brand.findByPk(id);
  if (!brand) throw new Error("Brand not found");
  return await brand.update(data);
};

export const deleteBrand = async (id) => {
  const brand = await Brand.findByPk(id);
  if (!brand) throw new Error("Brand not found");
  await brand.destroy();
  return true;
};
