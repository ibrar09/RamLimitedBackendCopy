import { CartItem, Product, ProductVariant, User } from "../models/index.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, variant_id, quantity } = req.body;

    // Validate user and product exist
    const user = await User.findByPk(user_id);
    const product = await Product.findByPk(product_id);
    if (!user || !product) {
      return res.status(400).json({ message: "Invalid user or product" });
    }

    const existingItem = await CartItem.findOne({
      where: { user_id, product_id, variant_id: variant_id || null },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({ message: "Cart updated", item: existingItem });
    }

    const newItem = await CartItem.create({
      user_id,
      product_id,
      variant_id: variant_id || null,
      quantity,
    });
    res.status(201).json({ message: "Item added to cart", item: newItem });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all cart items for a user
export const getUserCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    const cartItems = await CartItem.findAll({
      where: { user_id },
      include: [
        { model: Product, as: "product" },           // must match alias in CartItem association
        { model: ProductVariant, as: "variant" },   // must match alias in CartItem association
        { model: User, as: "user" },                // optional: include user info if needed
      ],
    });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Get user cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await CartItem.findByPk(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    await item.save();

    res.status(200).json({ message: "Cart item updated", item });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete single cart item
export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CartItem.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: "Cart item not found" });

    res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Clear all cart items for a user
export const clearUserCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    await CartItem.destroy({ where: { user_id } });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Clear user cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
