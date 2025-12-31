import * as variantService from "../services/productVariantService.js";

export const createVariant = async (req, res) => {
  try {
    const variant = await variantService.createVariant(req.body);
    res.status(201).json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllVariants = async (req, res) => {
  try {
    const variants = await variantService.getAllVariants();
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVariantsByProductId = async (req, res) => {
  try {
    const variants = await variantService.getVariantsByProductId(req.params.product_id);
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const variant = await variantService.updateVariant(req.params.id, req.body);
    res.json(variant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    await variantService.deleteVariant(req.params.id);
    res.json({ message: "Variant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
