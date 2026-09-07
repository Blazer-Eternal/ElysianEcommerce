import { Document, Types } from "mongoose";
import { RoleEnum } from "../enums/UserEnums";

export interface AddressInterface {
  _id?: Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

export interface InputUserInterface {
  name: string;
  email: string;
  password_hash: string;
  phone: string;
  role: RoleEnum;
  addresses: AddressInterface[];
  reset_password_token?: string | null;
  reset_password_expires?: Date | null;
}

export interface UserInterface extends InputUserInterface, Document {
  created_at: Date;
}