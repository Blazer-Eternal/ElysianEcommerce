import { Router } from "express";
import { LoyaltyController } from "../controllers/LoyaltyControllers";
import { exceptionHandler, Guard } from "../../middleware";

const loyaltyRoutes = Router();

// Any logged-in customer: their own tier, cycle, checklist and points.
loyaltyRoutes.get("/", exceptionHandler(Guard.grantAccess), exceptionHandler(LoyaltyController.getSummary));

export default loyaltyRoutes;
