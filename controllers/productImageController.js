import * as productImageService from "../services/productImageService.js";

export const createProductImage = async (req, res) => {
  try {
    const image = await productImageService.createProductImage(req.body);
    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllProductImages = async (req, res) => {
  try {
    const images = await productImageService.getAllProductImages();
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getProductImagesByProductId = async (req, res) => {
  try {
    const images = await productImageService.getProductImagesByProductId(req.params.productId);
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateProductImage = async (req, res) => {
  try {
    const image = await productImageService.updateProductImage(req.params.id, req.body);
    res.json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    await productImageService.deleteProductImage(req.params.id);
    res.json({ message: "Product image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
