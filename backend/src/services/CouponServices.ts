import { CouponModel } from "../models/CouponModel";
import { CouponInterface, InputCouponInterface } from "../intefaces/CouponInterface";

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
}