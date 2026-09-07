import { Router } from "express";
import { CategoryController } from "../controllers/CategoryControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { RoleEnum } from "../../enums/UserEnums";
import { createCategoryValidator, updateCategoryValidator } from "../../validators/CategoryValidator";

const categoryRoutes = Router();

categoryRoutes.get("/", exceptionHandler(CategoryController.getAllCategories));
categoryRoutes.get("/:id", exceptionHandler(CategoryController.getCategoryById));
categoryRoutes.get("/:id/children", exceptionHandler(CategoryController.getChildren));

categoryRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(createCategoryValidator)),
  exceptionHandler(CategoryController.createCategory)
);

categoryRoutes.patch(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updateCategoryValidator)),
  exceptionHandler(CategoryController.updateCategory)
);

categoryRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(CategoryController.deleteCategory)
);

export default categoryRoutes;