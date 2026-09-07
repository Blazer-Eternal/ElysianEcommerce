import { Router } from "express";
import { exceptionHandler, Guard, Validator, authLimiter } from "../../middleware";
import {
  signupValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../../validators/UserValidator";
import { AuthController } from "../controllers/authControllers";

const authRoutes = Router();

authRoutes.post("/signup", authLimiter, exceptionHandler(Validator.check(signupValidator)), exceptionHandler(AuthController.signup));
authRoutes.post("/login", authLimiter, exceptionHandler(Validator.check(loginValidator)), exceptionHandler(AuthController.login));
authRoutes.post("/logout", exceptionHandler(AuthController.logout));

authRoutes.patch(
  "/change-password",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(changePasswordValidator)),
  exceptionHandler(AuthController.changePassword)
);

authRoutes.post(
  "/forgot-password",
  authLimiter,
  exceptionHandler(Validator.check(forgotPasswordValidator)),
  exceptionHandler(AuthController.forgotPassword)
);

authRoutes.post(
  "/reset-password",
  authLimiter,
  exceptionHandler(Validator.check(resetPasswordValidator)),
  exceptionHandler(AuthController.resetPassword)
);

export default authRoutes;