import * as reviewService from "../services/productReviewService.js";
import { OrderItem, Order ,ProductReview ,User } from "../models/index.js";

/* ================= CREATE REVIEW ================= */
export const createReview = async (req, res) => {
  try {
    const { product_id, rating, review_text } = req.body;
    const userId = req.user.id;

    console.log("=== Create Review Attempt ===");
    console.log("User ID:", userId, "Product ID:", product_id);

    // ✅ Check if user purchased the product
    const purchased = await OrderItem.findOne({
      where: { product_id },
      include: [
        {
          model: Order,
          as: "order",
          required: true,
          where: {
            user_id: userId,
            payment_status: "paid",
            status: "completed"
          },
        },
      ],
    });

    if (!purchased) {
      return res.status(403).json({
        success: false,
        message: "Please purchase this product before leaving a review.",
      });
    }

    console.log("Purchased order:", purchased);

    // ✅ Create the review
    const review = await reviewService.createReview({
      product_id,
      user_id: userId,
      rating,
      review_text,
    });

    console.log("Review created:", review);

    return res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    console.error("Error in createReview:", err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= GET ALL REVIEWS ================= */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET APPROVED REVIEWS BY PRODUCT ================= */
export const getReviewsByProductId = async (req, res) => {
  try {
    const reviews = await ProductReview.findAll({
      where: { product_id: req.params.product_id, status: "approved" },
      include: [
        {
          model: User,
          as: "reviewer", // updated alias
          attributes: ["id", "name"],
        },
      ],
    });

    const formatted = reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      review_text: r.review_text,
      reviewer_name: r.reviewer?.name || "Anonymous",
      created_at: r.created_at,
    }));

    return res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("getReviewsByProductId error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
/* ================= UPDATE REVIEW ================= */
export const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* ================= DELETE REVIEW ================= */
export const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
