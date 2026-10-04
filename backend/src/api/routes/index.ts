import express from "express";
import bodyParser from "body-parser";

import authRoutes from "./authRoutes";
import userRoutes from "./UserRoutes";
import categoryRoutes from "./CategoryRoutes";
import productRoutes from "./ProductRoutes";
import couponRoutes from "./CouponRoutes";
import cartRoutes from "./CartRoutes";
import reviewRoutes from "./ReviewRoutes";
import wishlistRoutes from "./WishlistRoutes";
import orderRoutes from "./OrderRoutes";
import messageRoutes from "./MessageRoutes";
import notificationRoutes from "./NotificationRoutes";

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/coupons", couponRoutes);
router.use("/cart", cartRoutes);
router.use("/reviews", reviewRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/orders", orderRoutes);
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);


export default router;