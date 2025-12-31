// controllers/subcategoryController.js
import * as subcategoryService from "../services/subcategoryService.js";

export const createSubcategory = async (req, res) => {
  try {
    const subcategory = await subcategoryService.createSubcategory(req.body);
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSubcategories = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // ✅ get language from query, default "en"
    const subcategories = await subcategoryService.getAllSubcategories(lang);
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubcategoryById = async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // ✅ language support
    const subcategory = await subcategoryService.getSubcategoryById(req.params.id, lang);
    if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const subcategory = await subcategoryService.updateSubcategory(req.params.id, req.body);
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    await subcategoryService.deleteSubcategory(req.params.id);
    res.json({ message: "Subcategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
