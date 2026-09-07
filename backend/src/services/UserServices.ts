import { UserModel } from "../models/UserModel";
import { UserInterface, InputUserInterface, AddressInterface } from "../intefaces/UserInterface";
import { PaginationOptions } from "../intefaces";

export class UserServices {
  public async findAll(options: PaginationOptions = {}) {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find().skip(skip).limit(limit),
      UserModel.countDocuments(),
    ]);

    return {
      users,
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

  public async findById(id: string): Promise<UserInterface | null> {
    return await UserModel.findById(id);
  }

  public async findone(email: string): Promise<UserInterface | null> {
    return await UserModel.findOne({ email }).select("+password_hash");
  }

  public async create(userData: InputUserInterface): Promise<UserInterface> {
    return await UserModel.create(userData);
  }

  public async update(id: string, userData: Partial<InputUserInterface>): Promise<UserInterface | null> {
    return await UserModel.findByIdAndUpdate(id, userData, { returnDocument: "after" });
  }

  public async delete(id: string): Promise<UserInterface | null> {
    return await UserModel.findByIdAndDelete(id);
  }

  public async addAddress(userId: string, address: AddressInterface): Promise<UserInterface | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: address } },
      { returnDocument: "after" }
    );
  }

  public async updateAddress(
    userId: string,
    addressId: string,
    addressData: Partial<AddressInterface>
  ): Promise<UserInterface | null> {
    const setFields: Record<string, any> = {};
    for (const [key, value] of Object.entries(addressData)) {
      setFields[`addresses.$.${key}`] = value;
    }

    return await UserModel.findOneAndUpdate(
      { _id: userId, "addresses._id": addressId },
      { $set: setFields },
      { returnDocument: "after" }
    );
  }

  public async removeAddress(userId: string, addressId: string): Promise<UserInterface | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { returnDocument: "after" }
    );
  }

  // Sets a hashed reset token + 15-minute expiry on the user
  public async setResetToken(userId: string, hashedToken: string, expires: Date): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      reset_password_token: hashedToken,
      reset_password_expires: expires,
    });
  }

  // Finds a user by a valid (unexpired) hashed reset token
  public async findByResetToken(hashedToken: string): Promise<UserInterface | null> {
    return await UserModel.findOne({
      reset_password_token: hashedToken,
      reset_password_expires: { $gt: new Date() },
    }).select("+password_hash +reset_password_token +reset_password_expires");
  }

  // Clears the reset token after successful use
  public async clearResetToken(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      reset_password_token: null,
      reset_password_expires: null,
    });
  }
}