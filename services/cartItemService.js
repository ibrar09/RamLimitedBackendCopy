// backend/services/cartService.js
import { Product, ProductVariant, User, ProductImage, CartItem } from "../models/index.js";

// Add new item to cart
export const addToCart = async (data) => {
  // data should include: user_id, product_id, variant_id, quantity, etc.
  return await CartItem.create(data);
};

// Get all cart items for a specific user
import { Product, ProductVariant, User, ProductImage, CartItem } from "../models/index.js";

export const getCartByUser = async (user_id) => {
  return await CartItem.findAll({
    where: { user_id },
    include: [
      {
        model: Product,
        as: "product", // ✅ matches alias in index.js
        attributes: ["id", "name", "price"],
        include: [
          { model: ProductImage, as: "images", attributes: ["id", "url"] },
        ],
      },
      {
        model: ProductVariant, 
        // as: "variant", ❌ remove this line
        attributes: ["id", "name", "price"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });
};

// Update a cart item by ID
export const updateCartItem = async (id, data) => {
  const item = await CartItem.findByPk(id);
  if (!item) throw new Error("Cart item not found");
  return await item.update(data);
};

// Delete a cart item by ID
export const deleteCartItem = async (id) => {
  const item = await CartItem.findByPk(id);
  if (!item) throw new Error("Cart item not found");
  await item.destroy();
  return true;
};

// Clear all cart items for a specific user
export const clearCartByUser = async (user_id) => {
  return await CartItem.destroy({ where: { user_id } });
};
e