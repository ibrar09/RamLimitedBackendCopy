import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  deleteCartItem,
  clearUserCart
} from "../controllers/cartItemController.js";

const router = express.Router();

router.post("/", addToCart);

// ✅ Make sure your app mounts this as /api/v1/cart-items
router.get("/user/:user_id", getUserCart);
router.delete("/user/:user_id", clearUserCart);

router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

export default router;
