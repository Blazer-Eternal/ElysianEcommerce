import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { OrderServices, CartServices, ProductServices, CouponServices, EsewaServices } from "../../services";
import { RoleEnum } from "../../enums/UserEnums";
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from "../../enums/OrderEnums";
import { OrderItemInterface } from "../../intefaces/OrderInterface";

// Extracts the raw user id string whether user_id is populated or a plain ObjectId
const getOrderOwnerId = (userIdField: any): string => {
  if (userIdField && typeof userIdField === "object" && "_id" in userIdField) {
    return userIdField._id.toString();
  }
  return userIdField.toString();
};

export class OrderController {
  static async createOrder(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const { shipping_address, coupon_code, payment_method } = req.body;

    try {
      const cart = await new CartServices().findRawByUserId(userId);
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Your cart is empty" });
      }

      const orderItems: OrderItemInterface[] = [];
      let subtotal = 0;

      for (const cartItem of cart.items) {
        const product = await new ProductServices().findById(cartItem.product_id.toString());
        if (!product) {
          return res.status(404).json({ success: false, message: "One or more products in your cart no longer exist" });
        }
        if (product.stock < cartItem.quantity) {
          return res.status(400).json({ success: false, message: `Only ${product.stock} units of '${product.name}' in stock` });
        }

        orderItems.push({
          product_id: product._id as any,
          product_name: product.name,
          quantity: cartItem.quantity,
          unit_price: product.price,
        });

        subtotal += product.price * cartItem.quantity;
      }

      let discount = 0;
      let couponId = null;

      if (coupon_code) {
        const coupon = await new CouponServices().findByCode(coupon_code);
        if (!coupon) {
          return res.status(404).json({ success: false, message: "Invalid coupon code" });
        }
        if (!coupon.is_active) {
          return res.status(400).json({ success: false, message: "This coupon is no longer active" });
        }
        if (new Date() > coupon.expiry_date) {
          return res.status(400).json({ success: false, message: "This coupon has expired" });
        }
        if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
          return res.status(400).json({ success: false, message: "This coupon has reached its usage limit" });
        }
        if (subtotal < coupon.min_order_amount) {
          return res.status(400).json({
            success: false,
            message: `Order amount must be at least ${coupon.min_order_amount} to use this coupon`,
          });
        }

        discount = coupon.discount_type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
        discount = Math.min(discount, subtotal);
        couponId = coupon._id;

        await new CouponServices().incrementUsedCount(coupon._id.toString());
      }

      const total_amount = subtotal - discount;

      for (const item of orderItems) {
        const product = await new ProductServices().findById(item.product_id.toString());
        if (product) {
          await new ProductServices().updateStock(item.product_id.toString(), product.stock - item.quantity);
        }
      }

      const order_number = new OrderServices().generateOrderNumber();

      const order = await new OrderServices().create({
        user_id: userId as any,
        order_number,
        items: orderItems,
        shipping_address,
        coupon_id: couponId,
        subtotal,
        discount,
        total_amount,
        status: OrderStatusEnum.pending,
        payment_status: PaymentStatusEnum.unpaid,
        payment_method: payment_method as PaymentMethodEnum,
      });

      await new CartServices().clearCart(userId);

      // COD — nothing further needed, order is placed as-is.
      if (payment_method === PaymentMethodEnum.cod) {
        return res.status(201).json({ success: true, message: "Order placed successfully", data: order });
      }

      // eSewa — build the signed payment form fields for the frontend to
      // auto-submit to eSewa's gateway. Order stays 'pending'/'unpaid' until
      // the payment is verified via the success redirect.
      const esewaService = new EsewaServices();
      const fields = esewaService.buildPaymentFields(order_number, total_amount);

      return res.status(201).json({
        success: true,
        message: "Order created, redirecting to eSewa",
        data: order,
        esewa: {
          fields,
          gatewayUrl: esewaService.gatewayUrl(),
        },
      });
    } catch (error) {
      console.error("createOrder error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Called by the frontend's payment-success page after eSewa redirects back.
  // Independently re-checks the transaction status with eSewa before marking paid.
  static async verifyEsewaPayment(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const orderNumber = req.query.order_number as string;

    try {
      if (!orderNumber) {
        return res.status(400).json({ success: false, message: "Missing order_number" });
      }

      const order = await new OrderServices().findByOrderNumber(orderNumber);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      const ownerId = getOrderOwnerId(order.user_id);
      if (ownerId !== userId && req.user?.role !== RoleEnum.admin) {
        return res.status(403).json({ success: false, message: "You can only verify your own orders" });
      }

      if (order.payment_status === PaymentStatusEnum.paid) {
        return res.status(200).json({ success: true, message: "Payment already verified", data: order });
      }

      const isVerified = await new EsewaServices().verifyTransaction(order.order_number, order.total_amount);

      if (!isVerified) {
        return res.status(400).json({ success: false, message: "Payment could not be verified" });
      }

      await new OrderServices().updatePaymentStatus(order._id.toString(), PaymentStatusEnum.paid);
      const updatedOrder = await new OrderServices().updateStatus(order._id.toString(), OrderStatusEnum.paid);

      return res.status(200).json({ success: true, message: "Payment verified successfully", data: updatedOrder });
    } catch (error) {
      console.error("verifyEsewaPayment error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getMyOrders(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await new OrderServices().findByUser(userId, { page, limit });
      return res.status(200).json({ success: true, data: result.orders, pagination: result.pagination });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getOrderById(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const userId = req.user?.id as string;
    try {
      const order = await new OrderServices().findById(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      const ownerId = getOrderOwnerId(order.user_id);
      if (ownerId !== userId && req.user?.role !== RoleEnum.admin) {
        return res.status(403).json({ success: false, message: "You can only view your own orders" });
      }

      return res.status(200).json({ success: true, data: order });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async getAllOrders(req: CustomRequestInterface, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await new OrderServices().findAll({ page, limit });
      return res.status(200).json({ success: true, data: result.orders, pagination: result.pagination });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateOrderStatus(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const { status } = req.body;
    try {
      const order = await new OrderServices().findById(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      const updatedOrder = await new OrderServices().updateStatus(id, status);

      return res.status(200).json({ success: true, message: `Order status updated to '${status}'`, data: updatedOrder });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updatePaymentStatus(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const { payment_status } = req.body;
    try {
      const order = await new OrderServices().findById(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      const updatedOrder = await new OrderServices().updatePaymentStatus(id, payment_status);

      return res.status(200).json({
        success: true,
        message: `Payment status updated to '${payment_status}'`,
        data: updatedOrder,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async cancelOrder(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const userId = req.user?.id as string;
    try {
      const order = await new OrderServices().findById(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      const ownerId = getOrderOwnerId(order.user_id);
      if (ownerId !== userId && req.user?.role !== RoleEnum.admin) {
        return res.status(403).json({ success: false, message: "You can only cancel your own orders" });
      }

      if (order.status !== OrderStatusEnum.pending) {
        return res.status(400).json({ success: false, message: "Only pending orders can be cancelled" });
      }

      for (const item of order.items) {
        const product = await new ProductServices().findById(item.product_id.toString());
        if (product) {
          await new ProductServices().updateStock(item.product_id.toString(), product.stock + item.quantity);
        }
      }

      const updatedOrder = await new OrderServices().updateStatus(id, OrderStatusEnum.cancelled);

      return res.status(200).json({ success: true, message: "Order cancelled successfully", data: updatedOrder });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateShippingAddress(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const userId = req.user?.id as string;
    const { shipping_address } = req.body;

    try {
      const order = await new OrderServices().findById(id);
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });

      const ownerId = getOrderOwnerId(order.user_id);
      if (ownerId !== userId && req.user?.role !== RoleEnum.admin) {
        return res.status(403).json({ success: false, message: "You can only update your own orders" });
      }

      if (order.status !== OrderStatusEnum.pending && order.status !== OrderStatusEnum.paid) {
        return res.status(400).json({ success: false, message: "You can only update address for pending or paid orders" });
      }

      const updatedOrder = await new OrderServices().updateShippingAddress(id, shipping_address);

      return res.status(200).json({ success: true, message: "Shipping address updated successfully", data: updatedOrder });
    } catch (error) {
      console.error("updateShippingAddress error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}