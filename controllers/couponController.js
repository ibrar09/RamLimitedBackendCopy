// controllers/couponController.js
import * as couponService from "../services/couponService.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.status(200).json(coupons);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.status(200).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.status(200).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.status(200).json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
