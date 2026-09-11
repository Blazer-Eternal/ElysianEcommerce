import { OrderModel } from "../models/OrderModel";
import { OrderInterface, InputOrderInterface, PaginationOptions } from "../intefaces";
import { OrderStatusEnum, PaymentStatusEnum } from "../enums/OrderEnums";

export class OrderServices {
  public async findByUser(userId: string, options: PaginationOptions = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      OrderModel.find({ user_id: userId }).sort({ created_at: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments({ user_id: userId }),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  public async findAll(options: PaginationOptions = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      OrderModel.find().populate("user_id", "name email").sort({ created_at: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments(),
    ]);

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  public async findById(id: string): Promise<OrderInterface | null> {
    return await OrderModel.findById(id).populate("user_id", "name email").populate("coupon_id", "code discount_type value");
  }

  public async findByOrderNumber(orderNumber: string): Promise<OrderInterface | null> {
    return await OrderModel.findOne({ order_number: orderNumber });
  }

  public async create(orderData: InputOrderInterface): Promise<OrderInterface> {
    return await OrderModel.create(orderData);
  }

  public async updateStatus(id: string, status: OrderStatusEnum): Promise<OrderInterface | null> {
    return await OrderModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" });
  }

  public async updatePaymentStatus(id: string, payment_status: PaymentStatusEnum): Promise<OrderInterface | null> {
    return await OrderModel.findByIdAndUpdate(id, { payment_status }, { returnDocument: "after" });
  }

  public async updateShippingAddress(id: string, shipping_address: any): Promise<OrderInterface | null> {
    return await OrderModel.findByIdAndUpdate(id, { shipping_address }, { returnDocument: "after" }).populate("user_id", "name email").populate("coupon_id", "code discount_type value");
  }

  public generateOrderNumber(): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `ORD-${datePart}-${randomPart}`;
  }
}