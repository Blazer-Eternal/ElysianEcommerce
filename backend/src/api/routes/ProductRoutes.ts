import { Router } from "express";
import { ProductController } from "../controllers/ProductControllers";
import { exceptionHandler, Guard, Validator, upload, compressImages } from "../../middleware";
import { RoleEnum } from "../../enums/UserEnums";
import { createProductValidator, updateProductValidator, updateStockValidator } from "../../validators/ProductValidator";

const productRoutes = Router();

productRoutes.get("/", exceptionHandler(ProductController.getAllProducts));
productRoutes.get("/:id", exceptionHandler(ProductController.getProductById));
productRoutes.get("/category/:categoryId", exceptionHandler(ProductController.getProductsByCategory));

productRoutes.post(
  "/upload-images",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  upload.array("images", 5),
  compressImages,
  exceptionHandler(ProductController.uploadImages)
);

productRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(createProductValidator)),
  exceptionHandler(ProductController.createProduct)
);

productRoutes.patch(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updateProductValidator)),
  exceptionHandler(ProductController.updateProduct)
);

productRoutes.patch(
  "/:id/stock",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updateStockValidator)),
  exceptionHandler(ProductController.updateStock)
);

productRoutes.delete(
  "/:id",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(ProductController.deleteProduct)
);

export default productRoutes;