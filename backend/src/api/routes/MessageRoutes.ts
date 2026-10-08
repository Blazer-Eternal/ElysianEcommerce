import { Router } from "express";
import { MessageController } from "../controllers/MessageControllers";
import { exceptionHandler, Guard, Validator, contactLimiter } from "../../middleware";
import { createMessageValidator, updateMessageValidator } from "../../validators/MessageValidator";
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

/*
 * Registered before "/:id" so "read" is never captured as an id, and before
 * the generic patch so a reply body never lands on the wrong handler.
 */
messageRoutes.patch(
  "/read/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(MessageController.markMessageRead)
);

// Admin: the thread + the sender's account and recent orders, side panel only.
messageRoutes.get(
  "/:id/context",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(MessageController.getMessageContext)
);

// Admin: retag, correct the subject, reply, archive.
messageRoutes.patch(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updateMessageValidator)),
  exceptionHandler(MessageController.updateMessage)
);

messageRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(MessageController.deleteMessage)
);

export default messageRoutes;
