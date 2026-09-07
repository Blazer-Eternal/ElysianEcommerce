import { Router } from "express";
import { ReviewController } from "../controllers/ReviewControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { createReviewValidator, updateReviewValidator } from "../../validators/ReviewValidator";

const reviewRoutes = Router();

// Public: view reviews for a product
reviewRoutes.get("/product/:productId", exceptionHandler(ReviewController.getProductReviews));

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