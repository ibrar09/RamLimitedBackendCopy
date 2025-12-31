// services/couponService.js
import  {Coupon}  from "../models/index.js";

export const createCoupon = async (data) => {
  return await Coupon.create(data);
};

export const getAllCoupons = async () => {
  return await Coupon.findAll();
};

export const getCouponById = async (id) => {
  return await Coupon.findByPk(id);
};

export const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) throw new Error("Coupon not found");
  return await coupon.update(data);
};

export const deleteCoupon = async (id) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) throw new Error("Coupon not found");
  return await coupon.destroy();
};
