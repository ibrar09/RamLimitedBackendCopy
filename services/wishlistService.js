import { Wishlist } from "../models/index.js";

export const addToWishlist = async (data) => {
  return await Wishlist.create(data);
};

export const getUserWishlist = async (user_id) => {
  return await Wishlist.findAll({ where: { user_id } });
};

export const removeFromWishlist = async (id) => {
  return await Wishlist.destroy({ where: { id } });
};

export const clearWishlist = async (user_id) => {
  return await Wishlist.destroy({ where: { user_id } });
};
