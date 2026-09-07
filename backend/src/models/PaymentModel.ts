import { Schema, model } from "mongoose";
import { PaymentInterface } from "../intefaces/PaymentInterface";
import { PaymentMethodEnum, GatewayPaymentStatusEnum } from "../enums/PaymentEnums";

const PaymentSchema = new Schema<PaymentInterface>({
  order_id: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  method: {
    type: String,
    enum: Object.values(PaymentMethodEnum),
    default: PaymentMethodEnum.cod,
  },
  status: {
    type: String,
    enum: Object.values(GatewayPaymentStatusEnum),
    default: GatewayPaymentStatusEnum.pending,
  },
  gateway_transaction_id: {
    type: String,
    default: null,
    unique: true,
    sparse: true, // allows many null values without violating uniqueness (COD has none)
  },
  gateway_response: {
    type: Schema.Types.Mixed,
    default: null,
  },
  paid_at: {
    type: Date,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const PaymentModel = model<PaymentInterface>("Payment", PaymentSchema);