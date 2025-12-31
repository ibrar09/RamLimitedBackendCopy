import { SubcategoryItem, Subcategory } from "../models/index.js";

export const createSubcategoryItem = async (data) => {
  return await SubcategoryItem.create(data);
};

export const getAllSubcategoryItems = async () => {
  return await SubcategoryItem.findAll({
    include: [{ model: Subcategory, as: "subcategory" }],
    order: [["id", "ASC"]],
  });
};

export const getSubcategoryItemById = async (id) => {
  return await SubcategoryItem.findByPk(id, {
    include: [{ model: Subcategory, as: "subcategory" }],
  });
};

export const updateSubcategoryItem = async (id, data) => {
  const item = await SubcategoryItem.findByPk(id);
  if (!item) throw new Error("Subcategory Item not found");
  return await item.update(data);
};

export const deleteSubcategoryItem = async (id) => {
  const item = await SubcategoryItem.findByPk(id);
  if (!item) throw new Error("Subcategory Item not found");
  await item.destroy();
  return true;
};
