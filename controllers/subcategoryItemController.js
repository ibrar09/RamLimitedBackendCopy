import * as subcategoryItemService from "../services/subcategoryItemService.js";

export const createSubcategoryItem = async (req, res) => {
  try {
    const item = await subcategoryItemService.createSubcategoryItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllSubcategoryItems = async (req, res) => {
  try {
    const items = await subcategoryItemService.getAllSubcategoryItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSubcategoryItemById = async (req, res) => {
  try {
    const item = await subcategoryItemService.getSubcategoryItemById(req.params.id);
    if (!item) return res.status(404).json({ error: "Subcategory Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSubcategoryItem = async (req, res) => {
  try {
    const item = await subcategoryItemService.updateSubcategoryItem(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSubcategoryItem = async (req, res) => {
  try {
    await subcategoryItemService.deleteSubcategoryItem(req.params.id);
    res.json({ message: "Subcategory Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
