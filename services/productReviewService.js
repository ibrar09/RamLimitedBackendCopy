import { ProductReview } from "../models/index.js";

export const createReview = async ({ product_id, user_id, rating, review_text }) => {
  if (!product_id || !user_id || !rating || !review_text) {
    throw new Error("Missing required fields for creating a review");
  }

  const review = await ProductReview.create({
    product_id,
    user_id,
    rating,
    review_text,
    status: "approved", // or "pending" if you want manual approval
  });

  return review;
};

export const getAllReviews = async () => {
  return await ProductReview.findAll({
    include: [{ model: "User", as: "reviewer" }],
  });
};

export const updateReview = async (id, data) => {
  const review = await ProductReview.findByPk(id);
  if (!review) throw new Error("Review not found");

  await review.update(data);
  return review;
};

export const deleteReview = async (id) => {
  const review = await ProductReview.findByPk(id);
  if (!review) throw new Error("Review not found");

  await review.destroy();
  return true;
};
