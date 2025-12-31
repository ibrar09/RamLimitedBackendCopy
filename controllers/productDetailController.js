import * as productDetailService from "../services/productDetailService.js";

// Create
export const createProductDetail = async (req, res) => {
  try {
    const detail = await productDetailService.createProductDetail(req.body);
    res.status(201).json(detail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all
export const getAllProductDetails = async (req, res) => {
  try {
    const details = await productDetailService.getAllProductDetails();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getProductDetailById = async (req, res) => {
  try {
    const detail = await productDetailService.getProductDetailById(req.params.id);
    res.json(detail);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Update
export const updateProductDetail = async (req, res) => {
  try {
    const detail = await productDetailService.updateProductDetail(req.params.id, req.body);
    res.json(detail);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Delete
export const deleteProductDetail = async (req, res) => {
  try {
    const result = await productDetailService.deleteProductDetail(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
