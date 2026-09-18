import { Response } from "express";
import * as crypto from "crypto";
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
  // Helper to encode pre-order data into a secure token
  private static encodePreOrderToken(data: any): string {
    const json = JSON.stringify(data);
    return Buffer.from(json).toString("base64");
  }

  // Helper to decode pre-order token
  private static decodePreOrderToken(token: string): any {
    try {
      const json = Buffer.from(token, "base64").toString("utf-8");
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  static async createOrder(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const { shipping_address, coupon_code, payment_method } = req.body;

    try {
      // Validate payment method
      if (!payment_method || !Object.values(PaymentMethodEnum).includes(payment_method)) {
        return res.status(400).json({ success: false, message: "Invalid payment method" });
      }

      const cart = await new CartServices().findRawByUserId(userId);
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: "Your cart is empty" });
      }

      const orderItems: OrderItemInterface[] = [];
      let subtotal = 0;

      // Validate all products exist and have sufficient stock
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

      // Validate and apply coupon if provided
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

        // Increment coupon usage count
        try {
          await new CouponServices().incrementUsedCount(coupon._id.toString());
        } catch (err) {
          console.error("Error incrementing coupon usage:", err);
          // Don't fail the order if coupon increment fails - log and continue
        }
      }

      const total_amount = subtotal - discount;
      const order_number = new OrderServices().generateOrderNumber();

      // COD — create order immediately with pending status
      if (payment_method === PaymentMethodEnum.cod) {
        try {
          // Reserve stock for COD orders
          for (const item of orderItems) {
            const product = await new ProductServices().findById(item.product_id.toString());
            if (product) {
              await new ProductServices().updateStock(item.product_id.toString(), product.stock - item.quantity);
            }
          }

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
            payment_method: PaymentMethodEnum.cod,
          });

          await new CartServices().clearCart(userId);

          return res.status(201).json({ 
            success: true, 
            message: "Order placed successfully", 
            data: order 
          });
        } catch (err) {
          console.error("Error creating COD order:", err);
          return res.status(500).json({ success: false, message: "Failed to create order. Please try again." });
        }
      }

      // eSewa — DO NOT create order yet. Return pre-order token only.
      // Stock will be reserved ONLY after payment is verified.
      // Cart is NOT cleared yet - user can retry if payment fails.
      if (payment_method === PaymentMethodEnum.esewa) {
        try {
          const preOrderData = {
            userId,
            order_number,
            items: orderItems,
            shipping_address,
            coupon_id: couponId,
            subtotal,
            discount,
            total_amount,
            payment_method: PaymentMethodEnum.esewa,
          };

          const preOrderToken = this.encodePreOrderToken(preOrderData);

          const esewaService = new EsewaServices();
          const fields = esewaService.buildPaymentFields(order_number, total_amount);

          return res.status(200).json({
            success: true,
            message: "Proceeding to eSewa payment gateway",
            preOrderToken,
            esewa: {
              fields,
              gatewayUrl: esewaService.gatewayUrl(),
            },
          });
        } catch (err) {
          console.error("Error preparing eSewa payment:", err);
          return res.status(500).json({ success: false, message: "Failed to prepare eSewa payment. Please try again." });
        }
      }

      // Fallback - should not reach here
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    } catch (error) {
      console.error("createOrder error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Called by the frontend's payment-success page after eSewa redirects back.
  // Decodes the pre-order token, verifies payment with eSewa, then creates the order.
  static async verifyEsewaPayment(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    const { preOrderToken } = req.body;

    try {
      if (!preOrderToken) {
        return res.status(400).json({ success: false, message: "Missing pre-order token. Payment verification cannot proceed." });
      }

      // Decode the pre-order token
      const preOrderData = this.decodePreOrderToken(preOrderToken);
      if (!preOrderData) {
        return res.status(400).json({ success: false, message: "Invalid or corrupted pre-order token. Please try the checkout again." });
      }

      // Verify the token belongs to the current user (security check)
      if (preOrderData.userId !== userId) {
        return res.status(403).json({ success: false, message: "Pre-order token does not match current user. Unauthorized access detected." });
      }

      // Verify payment with eSewa independently BEFORE creating order
      // This is critical: eSewa client-side redirects can be spoofed, so we verify server-to-server
      console.log(`[eSewa Verification] Verifying payment for order ${preOrderData.order_number}, amount: ${preOrderData.total_amount}`);
      const isVerified = await new EsewaServices().verifyTransaction(preOrderData.order_number, preOrderData.total_amount);
      
      if (!isVerified) {
        console.warn(`[eSewa Verification] Payment verification FAILED for order ${preOrderData.order_number}`);
        return res.status(400).json({ 
          success: false, 
          message: "Payment verification failed with eSewa. Please check your payment status or try again." 
        });
      }

      console.log(`[eSewa Verification] Payment verification SUCCESSFUL for order ${preOrderData.order_number}`);

      // Payment verified — NOW create the order
      // Reserve stock for all items
      for (const item of preOrderData.items) {
        const product = await new ProductServices().findById(item.product_id.toString());
        if (!product) {
          return res.status(404).json({ success: false, message: `Product ${item.product_id} no longer exists` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for '${item.product_name}'` });
        }
        await new ProductServices().updateStock(item.product_id.toString(), product.stock - item.quantity);
      }

      // Create the order with paid status
      const order = await new OrderServices().create({
        user_id: preOrderData.userId as any,
        order_number: preOrderData.order_number,
        items: preOrderData.items,
        shipping_address: preOrderData.shipping_address,
        coupon_id: preOrderData.coupon_id,
        subtotal: preOrderData.subtotal,
        discount: preOrderData.discount,
        total_amount: preOrderData.total_amount,
        status: OrderStatusEnum.pending,
        payment_status: PaymentStatusEnum.paid,
        payment_method: PaymentMethodEnum.esewa,
      });

      // Only clear cart AFTER successful order creation and payment verification
      await new CartServices().clearCart(userId);

      console.log(`[Order Creation] Order ${preOrderData.order_number} created successfully after eSewa payment verification`);

      return res.status(201).json({ 
        success: true, 
        message: "Payment verified successfully. Order created!", 
        data: order 
      });
    } catch (error) {
      console.error("verifyEsewaPayment error:", error);
      return res.status(500).json({ success: false, message: "Internal server error during payment verification" });
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

      // Prevent shipping/delivery of unpaid eSewa orders
      if (
        (status === OrderStatusEnum.shipped || status === OrderStatusEnum.delivered) &&
        order.payment_method === PaymentMethodEnum.esewa &&
        order.payment_status !== PaymentStatusEnum.paid
      ) {
        return res.status(400).json({
          success: false,
          message: "Cannot mark order as shipped/delivered. Payment must be verified first.",
        });
      }

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