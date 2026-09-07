import { Router } from "express";
import { CouponController } from "../controllers/CouponControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { RoleEnum } from "../../enums/UserEnums";
import { createCouponValidator, updateCouponValidator, applyCouponValidator } from "../../validators/CouponValidator";

const couponRoutes = Router();

// Any logged-in user: validate/apply a coupon at checkout
couponRoutes.post(
  "/apply",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(applyCouponValidator)),
  exceptionHandler(CouponController.applyCoupon)
);

// Admin: manage coupons
couponRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(CouponController.getAllCoupons)
);

couponRoutes.get(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(CouponController.getCouponById)
);

couponRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(createCouponValidator)),
  exceptionHandler(CouponController.createCoupon)
);

couponRoutes.patch(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updateCouponValidator)),
  exceptionHandler(CouponController.updateCoupon)
);

couponRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(CouponController.deleteCoupon)
);

export default couponRoutes;