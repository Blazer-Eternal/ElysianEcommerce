import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { CouponServices } from "../../services";

export class CouponController {
  // Admin: list all coupons
  static async getAllCoupons(req: CustomRequestInterface, res: Response) {
    try {
      const coupons = await new CouponServices().findAll();
      return res.status(200).json({ success: true, data: coupons });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Admin: get single coupon by id
  static async getCouponById(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    try {
      const coupon = await new CouponServices().findById(id);
      if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

      return res.status(200).json({ success: true, data: coupon });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Admin: create coupon
  static async createCoupon(req: CustomRequestInterface, res: Response) {
    const couponData = req.body;
    try {
      const existingCode = await new CouponServices().findByCode(couponData.code);
      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: `Coupon with code '${couponData.code.toUpperCase()}' already exists`,
        });
      }

      if (new Date(couponData.expiry_date) <= new Date()) {
        return res.status(400).json({ success: false, message: "Expiry date must be in the future" });
      }

      if (couponData.discount_type === "percentage" && couponData.value > 100) {
        return res.status(400).json({ success: false, message: "Percentage discount cannot exceed 100" });
      }

      const coupon = await new CouponServices().create({
        ...couponData,
        code: couponData.code.toUpperCase(),
      });

      return res.status(201).json({ success: true, message: "Coupon created successfully", data: coupon });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Admin: update coupon
  static async updateCoupon(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const couponData = req.body;
    try {
      const coupon = await new CouponServices().findById(id);
      if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

      if (couponData.expiry_date && new Date(couponData.expiry_date) <= new Date()) {
        return res.status(400).json({ success: false, message: "Expiry date must be in the future" });
      }

      const discountType = couponData.discount_type || coupon.discount_type;
      const value = couponData.value !== undefined ? couponData.value : coupon.value;
      if (discountType === "percentage" && value > 100) {
        return res.status(400).json({ success: false, message: "Percentage discount cannot exceed 100" });
      }

      if (couponData.code) {
        couponData.code = couponData.code.toUpperCase();
      }

      const updatedCoupon = await new CouponServices().update(id, couponData);

      return res.status(200).json({ success: true, message: "Coupon updated successfully", data: updatedCoupon });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Admin: delete coupon
  static async deleteCoupon(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    try {
      const coupon = await new CouponServices().findById(id);
      if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

      await new CouponServices().delete(id);

      return res.status(200).json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Any logged-in user: validate/apply a coupon code against an order amount
  static async applyCoupon(req: CustomRequestInterface, res: Response) {
    const { code, order_amount } = req.body;
    try {
      const coupon = await new CouponServices().findByCode(code);
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Invalid coupon code" });
      }

      if (!coupon.is_active) {
        return res.status(400).json({ success: false, message: "This coupon is no longer active" });
      }

      if (new Date() > coupon.expiry_date) {
        return res.status(400).json({ success: false, message: "This coupon has expired" });
      }

      if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
        return res.status(400).json({ success: false, message: "This coupon has reached its usage limit" });
      }

      if (order_amount < coupon.min_order_amount) {
        return res.status(400).json({
          success: false,
          message: `Order amount must be at least ${coupon.min_order_amount} to use this coupon`,
        });
      }

      let discount = 0;
      if (coupon.discount_type === "percentage") {
        discount = (order_amount * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }

      discount = Math.min(discount, order_amount);

      return res.status(200).json({
        success: true,
        message: "Coupon applied successfully",
        data: {
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_amount: discount,
          final_amount: order_amount - discount,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}