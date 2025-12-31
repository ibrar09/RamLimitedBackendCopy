import * as categoryService from "../services/categoryService.js";

export const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // ✅ get language from query, default "en"
    const categories = await categoryService.getAllCategories(lang);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // ✅ language support
    const category = await categoryService.getCategoryById(req.params.id, lang);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const search = async (req, res) => {
  try {
    const keyword = req.query.q;
    const lang = req.query.lang || "en"; // ✅ language support
    const result = await categoryService.searchCategories(keyword, lang);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
