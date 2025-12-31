import { Category } from "../models/index.js";
import { Op } from "sequelize";
import axios from "axios";
import slugify from "slugify";

// ---------------- Helper: Translate text dynamically ---------------- //
const translateText = async (text, targetLang) => {
  if (!text) return "";
  try {
    const res = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "en",
      target: targetLang,
      format: "text",
    });
    return res.data.translatedText;
  } catch (err) {
    console.error("Translation error:", err);
    return text; // fallback to English
  }
};

// ---------------- Helper: Generate Slug ---------------- //
const generateSlug = (text) => slugify(text || "", { lower: true, strict: true });

// ---------------- Category CRUD ---------------- //

/**
 * Create category if it does not exist (case-insensitive)
 * @param {Object} data - { name, status }
 * @param {string} lang - "en" or "ar"
 * @returns {Object} created or existing category
 */
export const createCategory = async (data, lang = "en") => {
  if (!data.name || !data.name.trim()) {
    throw new Error("Category name is required");
  }

  const nameTrimmed = data.name.trim();

  // Check if category already exists (case-insensitive)
  const existing = await Category.findOne({
    where: {
      name: { [Op.iLike]: nameTrimmed },
    },
  });

  if (existing) {
    if (lang === "ar") {
      existing.name = await translateText(existing.name, "ar");
    }
    return existing;
  }

  // Generate slug
  const slug = generateSlug(nameTrimmed);

  // Create category
  const newCategory = await Category.create({ ...data, slug });

  // Translate if Arabic
  if (lang === "ar") {
    newCategory.name = await translateText(newCategory.name, "ar");
  }

  return newCategory;
};

/**
 * Get all categories
 * @param {string} lang - "en" or "ar"
 */
export const getAllCategories = async (lang = "en") => {
  const categories = await Category.findAll({
    where: { status: "active" },
    order: [["id", "ASC"]],
  });

  if (lang === "ar") {
    for (let cat of categories) {
      cat.name = await translateText(cat.name, "ar");
    }
  }

  return categories;
};

/**
 * Get category by ID or slug
 * @param {number|string} idOrSlug
 * @param {string} lang
 */
export const getCategoryByIdOrSlug = async (idOrSlug, lang = "en") => {
  const whereClause = isNaN(idOrSlug)
    ? { slug: idOrSlug } // if not a number, treat as slug
    : { id: idOrSlug };

  const category = await Category.findOne({ where: whereClause });
  if (!category) return null;

  if (lang === "ar") {
    category.name = await translateText(category.name, "ar");
  }

  return category;
};

/**
 * Update category safely (checks for duplicate)
 */
export const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");

  if (data.name) {
    // Check duplicate name
    const existing = await Category.findOne({
      where: {
        name: { [Op.iLike]: data.name.trim() },
        id: { [Op.ne]: id },
      },
    });
    if (existing) throw new Error("Category name already exists");

    // Update slug if name changes
    data.slug = generateSlug(data.name);
  }

  return await category.update(data);
};

/**
 * Delete category
 */
export const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");
  await category.destroy();
  return true;
};

/**
 * Search categories by keyword
 */
export const searchCategories = async (keyword, lang = "en") => {
  if (!keyword || !keyword.trim()) return [];

  const categories = await Category.findAll({
    where: {
      name: { [Op.iLike]: `%${keyword.trim()}%` },
      status: "active",
    },
    order: [["id", "ASC"]],
  });

  if (lang === "ar") {
    for (let cat of categories) {
      cat.name = await translateText(cat.name, "ar");
    }
  }

  return categories;
};
