import { CouponModel } from "../models/CouponModel";
import { OrderModel } from "../models/OrderModel";
import { CouponInterface, InputCouponInterface } from "../intefaces/CouponInterface";
import { DiscountTypeEnum } from "../enums/CouponEnums";
import { OrderStatusEnum } from "../enums/OrderEnums";

/** A line being priced: a populated product plus quantity. */
export interface PricedLine {
  product: any;
  quantity: number;
}

export interface CouponEvaluation {
  ok: boolean;
  message?: string;
  discount: number;
  /** Subtotal of the items this coupon is allowed to touch. */
  eligibleSubtotal: number;
}

const categoryNameOf = (product: any): string => {
  const cat = product?.category_id;
  if (cat && typeof cat === "object" && typeof cat.name === "string") return cat.name.toLowerCase();
  return "";
};

const isElectronics = (product: any): boolean => categoryNameOf(product).includes("electronics");

const isOnSale = (product: any): boolean =>
  typeof product?.mrp === "number" && typeof product?.price === "number" && product.mrp > product.price;

export class CouponServices {
  public async findAll(): Promise<CouponInterface[]> {
    return await CouponModel.find().sort({ created_at: 1 });
  }

  public async findById(id: string): Promise<CouponInterface | null> {
    return await CouponModel.findById(id);
  }

  public async findByCode(code: string): Promise<CouponInterface | null> {
    return await CouponModel.findOne({ code: code.toUpperCase() });
  }

  public async create(couponData: InputCouponInterface): Promise<CouponInterface> {
    return await CouponModel.create(couponData);
  }

  public async update(id: string, couponData: Partial<InputCouponInterface>): Promise<CouponInterface | null> {
    return await CouponModel.findByIdAndUpdate(id, couponData, { returnDocument: "after" });
  }

  public async delete(id: string): Promise<CouponInterface | null> {
    return await CouponModel.findByIdAndDelete(id);
  }

  public async incrementUsedCount(id: string): Promise<CouponInterface | null> {
    return await CouponModel.findByIdAndUpdate(id, { $inc: { used_count: 1 } }, { returnDocument: "after" });
  }

  /**
   * Membership tier from the last 12 months of orders: qualifying spend is the
   * item subtotal after discounts, capped at Rs. 50,000 per order, counted only
   * for orders that were paid, shipped or delivered (not cancelled).
   */
  public static async getUserTier(userId: string): Promise<string> {
    const since = new Date(Date.now() - 365 * 86400000);
    const orders = await OrderModel.find({
      user_id: userId,
      created_at: { $gte: since },
      status: { $in: [OrderStatusEnum.paid, OrderStatusEnum.shipped, OrderStatusEnum.delivered] },
    }).select("subtotal discount");

    let qualifying = 0;
    for (const order of orders) {
      const net = Math.max(0, (order.subtotal ?? 0) - (order.discount ?? 0));
      qualifying += Math.min(net, 50000);
    }

    const thresholds = [
      { name: "diamond", minSpend: 250000, minOrders: 15 },
      { name: "platinum", minSpend: 100000, minOrders: 8 },
      { name: "gold", minSpend: 30000, minOrders: 3 },
    ];
    for (const t of thresholds) {
      if (qualifying >= t.minSpend && orders.length >= t.minOrders) return t.name;
    }
    return "bronze";
  }

  /**
   * Full rule evaluation for a coupon against a concrete cart.
   *
   * Scope: a coupon only discounts items in its `category_scope` (empty = all),
   * electronics are excluded from percentage coupons entirely (fixed-amount
   * electronics coupons set `electronics_only`), and sale items (price < MRP)
   * are excluded unless the coupon says otherwise. The order minimum is
   * measured on eligible items only. Percentage electronics exclusion and the
   * per-user / global limits are enforced here; callers must reject on ok=false.
   */
  public async evaluateCoupon(
    coupon: CouponInterface,
    userId: string,
    lines: PricedLine[]
  ): Promise<CouponEvaluation> {
    const fail = (message: string): CouponEvaluation => ({ ok: false, message, discount: 0, eligibleSubtotal: 0 });

    if (!coupon.is_active) return fail("This coupon is no longer active");
    const now = new Date();
    if (coupon.starts_at && now < new Date(coupon.starts_at)) {
      return fail("This coupon is not active yet");
    }
    if (now > new Date(coupon.expiry_date)) return fail("This coupon has expired");
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      return fail("This coupon has reached its usage limit");
    }

    if (coupon.per_user_limit !== null && coupon.per_user_limit !== undefined) {
      const windowStart = new Date(now.getTime() - (coupon.per_user_window_days ?? 30) * 86400000);
      const redemptions = await OrderModel.countDocuments({
        user_id: userId,
        coupon_id: coupon._id,
        created_at: { $gte: windowStart },
      });
      if (redemptions >= coupon.per_user_limit) {
        return fail(`You have already used this coupon ${coupon.per_user_limit} time(s) in the last ${coupon.per_user_window_days ?? 30} days`);
      }
    }

    if (coupon.min_tier) {
      const tier = await CouponServices.getUserTier(userId);
      const rank = (t: string) => ["bronze", "gold", "platinum", "diamond"].indexOf(t);
      if (rank(tier) < rank(coupon.min_tier)) {
        return fail(`This coupon is reserved for ${coupon.min_tier} members and above`);
      }
    }

    const inScope = (product: any): boolean => {
      const scope = (coupon.category_scope ?? []).map((s) => s.toLowerCase());
      if (scope.length > 0 && !scope.includes(categoryNameOf(product))) return false;
      if (coupon.electronics_only && !isElectronics(product)) return false;
      if (coupon.exclude_electronics && isElectronics(product)) return false;
      if (coupon.exclude_sale_items !== false && isOnSale(product)) return false;
      // Percentage coupons never discount electronics, regardless of scope.
      if (coupon.discount_type === DiscountTypeEnum.percentage && isElectronics(product)) return false;
      return true;
    };

    const eligible = lines.filter((line) => inScope(line.product));
    const eligibleSubtotal = eligible.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

    if (eligibleSubtotal <= 0) {
      return fail("This coupon does not apply to any items in your cart");
    }
    if (eligibleSubtotal < coupon.min_order_amount) {
      return fail(`Eligible items must total at least ${coupon.min_order_amount} to use this coupon`);
    }

    let discount =
      coupon.discount_type === DiscountTypeEnum.percentage
        ? (eligibleSubtotal * coupon.value) / 100
        : coupon.value;

    if (coupon.max_discount !== null && coupon.max_discount !== undefined) {
      discount = Math.min(discount, coupon.max_discount);
    }
    discount = Math.min(discount, eligibleSubtotal);

    // Margin guardrail: the discounted line price must stay at least 5% above cost.
    const eligibleCost = eligible.reduce(
      (sum, line) => sum + (typeof line.product.cost_price === "number" ? line.product.cost_price : 0) * line.quantity,
      0
    );
    if (eligibleCost > 0) {
      const maxByCost = Math.max(0, eligibleSubtotal - eligibleCost * 1.05);
      discount = Math.min(discount, maxByCost);
    }

    discount = Math.round(discount * 100) / 100;
    if (discount <= 0) return fail("This coupon cannot be applied to this cart without undercutting our margins");

    return { ok: true, discount, eligibleSubtotal };
  }
}