import * as bannerService from "../services/bannerService.js";

// Helper to log errors
const logError = (context, err, req) => {
  console.error("===== Banner Error =====");
  console.error("Context:", context);
  console.error("Error Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("Request Body:", req.body);
  console.error("Request File:", req.file || "No file uploaded");
  console.error("========================");
};

export const getBanners = async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.json({ success: true, data: banners });
  } catch (err) {
    logError("getBanners", err, req);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBanner = async (req, res) => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }
    res.json({ success: true, data: banner });
  } catch (err) {
    logError("getBanner", err, req);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const createBanner = async (req, res) => {
  try {
    const data = req.body;

    // If image was uploaded, save URL (overriding body if necessary, but supporting both)
    if (req.file) {
      data.image_url = `/uploads/${req.file.filename}`;
    }

    const banner = await bannerService.createBanner(data);
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    console.error("Error in createBanner:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateBanner = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      console.log("File uploaded for update:", req.file.filename);
      data.image_url = `/uploads/${req.file.filename}`;
    } else {
      console.log("No file uploaded for update.");
    }

    const banner = await bannerService.updateBanner(req.params.id, data);
    res.json({ success: true, data: banner });
  } catch (err) {
    logError("updateBanner", err, req);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    logError("deleteBanner", err, req);
    res.status(500).json({ success: false, message: err.message });
  }
};
