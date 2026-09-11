import { Router } from "express";
import { OrderController } from "../controllers/OrderControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { RoleEnum } from "../../enums/UserEnums";
import { createOrderValidator, updateOrderStatusValidator, updatePaymentStatusValidator } from "../../validators/OrderValidator";

const orderRoutes = Router();

orderRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(createOrderValidator)),
  exceptionHandler(OrderController.createOrder)
);

orderRoutes.get("/my-orders", exceptionHandler(Guard.grantAccess), exceptionHandler(OrderController.getMyOrders));

orderRoutes.get(
  "/esewa/verify",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(OrderController.verifyEsewaPayment)
);

orderRoutes.get("/:id", exceptionHandler(Guard.grantAccess), exceptionHandler(OrderController.getOrderById));

orderRoutes.patch("/:id/cancel", exceptionHandler(Guard.grantAccess), exceptionHandler(OrderController.cancelOrder));

orderRoutes.patch(
  "/:id/shipping-address",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(OrderController.updateShippingAddress)
);

orderRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(OrderController.getAllOrders)
);

orderRoutes.patch(
  "/:id/status",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updateOrderStatusValidator)),
  exceptionHandler(OrderController.updateOrderStatus)
);

orderRoutes.patch(
  "/:id/payment-status",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updatePaymentStatusValidator)),
  exceptionHandler(OrderController.updatePaymentStatus)
);

export default orderRoutes;