import { Router } from "express";
import { WishlistController } from "../controllers/WishlistControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { addWishlistValidator } from "../../validators/WishlistValidator";

const wishlistRoutes = Router();

// All wishlist routes require login — always scoped to req.user.id, never a URL param
wishlistRoutes.get("/", exceptionHandler(Guard.grantAccess), exceptionHandler(WishlistController.getMyWishlist));

wishlistRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(addWishlistValidator)),
  exceptionHandler(WishlistController.addToWishlist)
);

wishlistRoutes.delete(
  "/:productId",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(WishlistController.removeFromWishlist)
);

export default wishlistRoutes;