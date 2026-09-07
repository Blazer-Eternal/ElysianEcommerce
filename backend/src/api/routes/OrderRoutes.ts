import { Router } from "express";
import { OrderController } from "../controllers/OrderControllers";
import { exceptionHandler, Guard, Validator } from "../../middleware";
import { RoleEnum } from "../../enums/UserEnums";
import { createOrderValidator, updateOrderStatusValidator, updatePaymentStatusValidator } from "../../validators/OrderValidator";

const orderRoutes = Router();

// Logged-in user: checkout
orderRoutes.post(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Validator.check(createOrderValidator)),
  exceptionHandler(OrderController.createOrder)
);

// Logged-in user: own order history
orderRoutes.get("/my-orders", exceptionHandler(Guard.grantAccess), exceptionHandler(OrderController.getMyOrders));

// Owner or admin: single order
orderRoutes.get("/:id", exceptionHandler(Guard.grantAccess), exceptionHandler(OrderController.getOrderById));

// Owner or admin: cancel order
orderRoutes.patch("/:id/cancel", exceptionHandler(Guard.grantAccess), exceptionHandler(OrderController.cancelOrder));

// Admin: view all orders
orderRoutes.get(
  "/",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(OrderController.getAllOrders)
);

// Admin: update order status
orderRoutes.patch(
  "/:id/status",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updateOrderStatusValidator)),
  exceptionHandler(OrderController.updateOrderStatus)
);

// Admin: update payment status
orderRoutes.patch(
  "/:id/payment-status",
  exceptionHandler(Guard.grantAccess),
  exceptionHandler(Guard.grantRole(RoleEnum.admin)),
  exceptionHandler(Validator.check(updatePaymentStatusValidator)),
  exceptionHandler(OrderController.updatePaymentStatus)
);

export default orderRoutes;