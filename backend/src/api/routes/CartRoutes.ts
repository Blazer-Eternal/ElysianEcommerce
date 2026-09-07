import { Router } from "express";
import { CartController } from "../controllers/CartControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { addCartItemValidator, updateCartItemValidator } from "../../validators/CartValidator";

const cartRoutes = Router();

// All cart routes require login — cart is always tied to req.user.id, never a URL param
cartRoutes.get("/", exceptionHandler(Guard.grantAccess), exceptionHandler(CartController.getMyCart));

cartRoutes.post(
  "/items",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(addCartItemValidator)),
  exceptionHandler(CartController.addItem)
);

cartRoutes.patch(
  "/items/:productId",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(updateCartItemValidator)),
  exceptionHandler(CartController.updateItem)
);

cartRoutes.delete("/items/:productId", exceptionHandler(Guard.grantAccess), exceptionHandler(CartController.removeItem));

cartRoutes.delete("/", exceptionHandler(Guard.grantAccess), exceptionHandler(CartController.clearCart));

export default cartRoutes;