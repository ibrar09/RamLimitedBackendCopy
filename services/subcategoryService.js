// services/subcategoryService.js
import { Subcategory, Category } from "../models/index.js";

/**
 * Create a new subcategory
 */
export const createSubcategory = async (data) => {
  return await Subcategory.create(data);
};

/**
 * Get all subcategories with optional language
 * @param {string} lang - 'en' or 'ar'
 */
export const getAllSubcategories = async (lang = "en") => {
  const nameField = lang === "ar" ? "name_ar" : "name";

  const subcategories = await Subcategory.findAll({
    include: [
      { model: Category, as: "category", attributes: ["id", nameField] },
    ],
    order: [["id", "ASC"]],
  });

  // Map to return consistent object key 'name'
  return subcategories.map((sub) => {
    const plain = sub.get({ plain: true });
    return {
      ...plain,
      name: plain[nameField], // use selected language field
      category_name: plain.category ? plain.category[nameField] : "-",
    };
  });
};

/**
 * Get a subcategory by ID with optional language
 * @param {number} id
 * @param {string} lang - 'en' or 'ar'
 */
export const getSubcategoryById = async (id, lang = "en") => {
  const nameField = lang === "ar" ? "name_ar" : "name";

  const subcategory = await Subcategory.findByPk(id, {
    include: [
      { model: Category, as: "category", attributes: ["id", nameField] },
    ],
  });

  if (!subcategory) return null;

  const plain = subcategory.get({ plain: true });
  return {
    ...plain,
    name: plain[nameField],
    category_name: plain.category ? plain.category[nameField] : "-",
  };
};

/**
 * Update a subcategory
 */
export const updateSubcategory = async (id, data) => {
  const subcategory = await Subcategory.findByPk(id);
  if (!subcategory) throw new Error("Subcategory not found");
  return await subcategory.update(data);
};

/**
 * Delete a subcategory
 */
export const deleteSubcategory = async (id) => {
  const subcategory = await Subcategory.findByPk(id);
  if (!subcategory) throw new Error("Subcategory not found");
  await subcategory.destroy();
  return true;
};
