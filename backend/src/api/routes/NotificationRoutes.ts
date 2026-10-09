import { Router } from "express";
import { NotificationController } from "../controllers/NotificationControllers";
import { CustomerNotificationController } from "../controllers/CustomerNotificationControllers";
import { exceptionHandler, Guard } from "../../middleware";
import { RoleEnum } from "../../enums/UserEnums";

const notificationRoutes = Router();

// Admin only: bell feed + unread badge count
notificationRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(NotificationController.getNotifications)
);

// Admin only: the Daily Update drawer (derived live from orders, stock,
// messages, reviews and a live storefront probe)
notificationRoutes.get(
  "/daily-brief",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(NotificationController.getDailyBrief)
);

// Admin only: clear the badge once the dropdown has been opened
notificationRoutes.post(
  "/read-all",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(NotificationController.markAllRead)
);

/*
 * Customer feed. Derived live from the signed-in customer's own orders,
 * wishlist, cart, coupons and reviews, nothing is stored as content, only the
 * read markers behind `read` / `unreadCount`. Registered after the admin
 * routes above; the literal "/" and "/read-all" paths never match "/customer".
 */
notificationRoutes.get(
  "/customer",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(CustomerNotificationController.getFeed)
);

notificationRoutes.post(
  "/customer/read",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(CustomerNotificationController.markRead)
);

export default notificationRoutes;
