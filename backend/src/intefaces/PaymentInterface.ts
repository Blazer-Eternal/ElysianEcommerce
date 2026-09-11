import { Document, Types } from "mongoose";
import { PaymentMethodEnum } from "../enums/OrderEnums";
import { GatewayPaymentStatusEnum } from "../enums/PaymentEnums";

export interface InputPaymentInterface {
  order_id: Types.ObjectId;
  user_id: Types.ObjectId;
  amount: number;
  method?: PaymentMethodEnum;
  status?: GatewayPaymentStatusEnum;
  gateway_transaction_id?: string | null;
  gateway_response?: Record<string, any> | null;
  paid_at?: Date | null;
}

export interface PaymentInterface extends Document {
  order_id: Types.ObjectId;
  user_id: Types.ObjectId;
  amount: number;
  method: PaymentMethodEnum;
  status: GatewayPaymentStatusEnum;
  gateway_transaction_id: string | null;
  gateway_response: Record<string, any> | null;
  paid_at: Date | null;
  created_at: Date;
}