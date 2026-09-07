import { Schema, model } from "mongoose";
import { UserInterface, AddressInterface } from "../intefaces/UserInterface";
import { RoleEnum } from "../enums/UserEnums";

const AddressSchema = new Schema<AddressInterface>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  is_default: { type: Boolean, default: false },
});

const UserSchema = new Schema<UserInterface>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(RoleEnum),
    default: RoleEnum.customer,
  },
  addresses: {
    type: [AddressSchema],
    default: [],
  },
  reset_password_token: {
    type: String,
    default: null,
    select: false,
  },
  reset_password_expires: {
    type: Date,
    default: null,
    select: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const UserModel = model<UserInterface>("User", UserSchema);