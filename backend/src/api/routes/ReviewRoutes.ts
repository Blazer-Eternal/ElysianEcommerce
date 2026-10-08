import { Router } from "express";
import { ReviewController } from "../controllers/ReviewControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { createReviewValidator, updateReviewValidator } from "../../validators/ReviewValidator";
import { RoleEnum } from "../../enums/UserEnums";

const reviewRoutes = Router();

// Admin only: get all reviews across all products
reviewRoutes.get(
  "/admin/all",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(ReviewController.getAllReviews)
);

// Logged-in user only: their own reviews across every product they bought
reviewRoutes.get(
  "/my",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(ReviewController.getMyReviews)
);

// Logged-in user only: view reviews for a product
reviewRoutes.get(
  "/product/:productId",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(ReviewController.getProductReviews)
);

// Logged-in user: create a review
reviewRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(createReviewValidator)),
  exceptionHandler(ReviewController.createReview)
);

// Owner: update own review
reviewRoutes.patch(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(updateReviewValidator)),
  exceptionHandler(ReviewController.updateReview)
);

// Owner or admin: delete review
reviewRoutes.delete("/:id", exceptionHandler(Guard.grantAccess), exceptionHandler(ReviewController.deleteReview));

export default reviewRoutes;