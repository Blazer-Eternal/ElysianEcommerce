import { Router } from "express";
import { NotificationController } from "../controllers/NotificationControllers";
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

// Admin only: clear the badge once the dropdown has been opened
notificationRoutes.post(
  "/read-all",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(NotificationController.markAllRead)
);

export default notificationRoutes;
