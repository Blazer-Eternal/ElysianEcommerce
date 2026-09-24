import { OrderModel } from "../models/OrderModel";
import { OrderInterface, InputOrderInterface, PaginationOptions } from "../intefaces";
import { OrderStatusEnum, PaymentStatusEnum, PaymentMethodEnum } from "../enums/OrderEnums";

// Aggregated dashboard numbers returned by getStats() - computed inside
// MongoDB, never shipped as raw order documents.
export interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: Record<OrderStatusEnum, number>;
  revenueLast30Days: number;
  averageOrderValue: number;
}

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

  // Single-database-round-trip dashboard aggregates. All math happens inside
  // MongoDB ($facet + $group) so the client receives only final numbers
  // instead of up to 100 full Order documents to sum client-side.
  public async getStats(): Promise<OrderStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Money actually received: payment_status = paid (the exact condition the
    // dashboard previously applied client-side; covers paid/shipped/delivered
    // orders for eSewa as well as admin-marked COD payments).
    const paid = { $eq: ["$payment_status", PaymentStatusEnum.paid] };

    const [result] = await OrderModel.aggregate([
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: { $cond: [paid, "$total_amount", 0] } },
                paidOrders: { $sum: { $cond: [paid, 1, 0] } },
                revenueLast30Days: {
                  $sum: {
                    $cond: [
                      { $and: [paid, { $gte: ["$created_at", thirtyDaysAgo] }] },
                      "$total_amount",
                      0,
                    ],
                  },
                },
              },
            },
          ],
          byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        },
      },
    ]);

    const totals = result?.totals?.[0];
    const totalOrders: number = totals?.totalOrders ?? 0;
    const totalRevenue: number = totals?.totalRevenue ?? 0;
    const paidOrders: number = totals?.paidOrders ?? 0;

    // Every status key is always present (0 when the bucket is empty) so the
    // response shape stays stable for the dashboard.
    const ordersByStatus = Object.values(OrderStatusEnum).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<OrderStatusEnum, number>
    );
    for (const bucket of result?.byStatus ?? []) {
      if (bucket && bucket._id != null) {
        ordersByStatus[bucket._id as OrderStatusEnum] = bucket.count;
      }
    }

    return {
      totalRevenue,
      totalOrders,
      ordersByStatus,
      revenueLast30Days: totals?.revenueLast30Days ?? 0,
      // Average value of the revenue-generating (paid) orders; 0 when none.
      averageOrderValue: paidOrders > 0 ? Math.round((totalRevenue / paidOrders) * 100) / 100 : 0,
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

  // Migrate existing eSewa orders with paid payment status but pending order status
  // This fixes orders created before the bug was fixed
  public async migratePaidEsewaOrders(): Promise<{ modifiedCount: number }> {
    const result = await OrderModel.updateMany(
      {
        payment_method: PaymentMethodEnum.esewa,
        payment_status: PaymentStatusEnum.paid,
        status: OrderStatusEnum.pending,
      },
      { status: OrderStatusEnum.paid }
    );
    return { modifiedCount: result.modifiedCount };
  }
}