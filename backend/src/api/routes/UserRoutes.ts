import { Router } from "express";
import { UserController } from "../controllers/UserControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { RoleEnum } from "../../enums/UserEnums";
import {
  updateUserValidator,
  assignRoleValidator,
  addressValidator,
  updateAddressValidator,
} from "../../validators/UserValidator";

const userRoutes = Router();

userRoutes.get("/:id", exceptionHandler(Guard.grantAccess), exceptionHandler(UserController.getUserById));

userRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(UserController.getAllUsers)
);

userRoutes.patch(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(updateUserValidator)),
  exceptionHandler(UserController.updateUser)
);

userRoutes.patch(
  "/:id/role",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(assignRoleValidator)),
  exceptionHandler(UserController.assignRole)
);

userRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(UserController.deleteUser)
);

// Address management
userRoutes.post(
  "/:id/addresses",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(addressValidator)),
  exceptionHandler(UserController.addAddress)
);

userRoutes.patch(
  "/:id/addresses/:addressId",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(updateAddressValidator)),
  exceptionHandler(UserController.updateAddress)
);

userRoutes.delete(
  "/:id/addresses/:addressId",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(UserController.removeAddress)
);

export default userRoutes;