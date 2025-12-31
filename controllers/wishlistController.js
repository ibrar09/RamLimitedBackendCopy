import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
  clearWishlist
} from "../services/wishlistService.js";

export const createWishlistItem = async (req, res) => {
  try {
    const wishlist = await addToWishlist(req.body);
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWishlistByUser = async (req, res) => {
  try {
    const items = await getUserWishlist(req.params.user_id);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteWishlistItem = async (req, res) => {
  try {
    await removeFromWishlist(req.params.id);
    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearUserWishlist = async (req, res) => {
  try {
    await clearWishlist(req.params.user_id);
    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
