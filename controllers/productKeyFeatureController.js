import * as featureService from "../services/productKeyFeatureService.js";

// Use names that match your router imports
export const createProductFeature = async (req, res) => {
  try {
    const feature = await featureService.createFeature(req.body);
    res.status(201).json(feature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllProductFeatures = async (req, res) => {
  try {
    const features = await featureService.getAllFeatures();
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductFeatureById = async (req, res) => {
  try {
    const features = await featureService.getFeaturesByProductId(req.params.id);
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProductFeature = async (req, res) => {
  try {
    const feature = await featureService.updateFeature(req.params.id, req.body);
    res.json(feature);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProductFeature = async (req, res) => {
  try {
    await featureService.deleteFeature(req.params.id);
    res.json({ message: "Feature deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
