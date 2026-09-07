import { Document } from "mongoose";
import { DiscountTypeEnum } from "../enums/CouponEnums";

export interface InputCouponInterface {
  code: string;
  discount_type: DiscountTypeEnum;
  value: number;
  min_order_amount?: number;
  expiry_date: Date;
  usage_limit?: number | null;
  is_active?: boolean;
}

export interface CouponInterface extends Document {
  code: string;
  discount_type: DiscountTypeEnum;
  value: number;
  min_order_amount: number;
  expiry_date: Date;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: Date;
}