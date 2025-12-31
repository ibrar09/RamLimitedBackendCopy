import { Banner } from "../models/index.js";

export const getAllBanners = async () => {
  return await Banner.findAll({ order: [["priority", "DESC"], ["createdAt", "DESC"]] });
};

export const getBannerById = async (id) => {
  return await Banner.findByPk(id);
};

export const createBanner = async (data) => {
  return await Banner.create(data);
};

export const updateBanner = async (id, data) => {
  const banner = await Banner.findByPk(id);
  if (!banner) throw new Error("Banner not found");
  return await banner.update(data);
};

export const deleteBanner = async (id) => {
  const banner = await Banner.findByPk(id);
  if (!banner) throw new Error("Banner not found");
  return await banner.destroy();
};
