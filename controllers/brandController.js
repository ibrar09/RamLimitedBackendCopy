import * as brandService from "../services/brandService.js";

export const createBrand = async (req, res) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brands = await brandService.getAllBrands();
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    res.json(brand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    await brandService.deleteBrand(req.params.id);
    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
