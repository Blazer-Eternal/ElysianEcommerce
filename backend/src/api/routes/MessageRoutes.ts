import { Router } from "express";
import { MessageController } from "../controllers/MessageControllers";
import { exceptionHandler, Guard, Validator, contactLimiter } from "../../middleware";
import { createMessageValidator } from "../../validators/MessageValidator";
import { RoleEnum } from "../../enums/UserEnums";

const messageRoutes = Router();

// Public: contact form on the Get in Touch / Contact Us page (rate-limited
// against spam since it needs no authentication).
messageRoutes.post(
  "/",
  contactLimiter,
  exceptionHandler(Validator.check(createMessageValidator)),
  exceptionHandler(MessageController.createMessage)
);

// Admin only: inbox listing
messageRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(MessageController.getAllMessages)
);

// Registered before "/:id" so "read" is never captured as an id.
messageRoutes.patch(
  "/read/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(MessageController.markMessageRead)
);

messageRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(MessageController.deleteMessage)
);

export default messageRoutes;
