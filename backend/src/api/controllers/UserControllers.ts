import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { RoleEnum } from "../../enums/UserEnums";
import { UserServices } from "../../services";

export class UserController {
  static async getAllUsers(req: CustomRequestInterface, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await new UserServices().findAll({ page, limit });
      return res.status(200).json({ success: true, data: result.users, pagination: result.pagination });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // Owner or admin only — a user cannot view someone else's profile
  static async getUserById(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;

    if (req.user?.id !== id && req.user?.role !== RoleEnum.admin) {
      return res.status(403).json({ success: false, message: "You can only view your own profile" });
    }

    try {
      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateUser(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const { name, email, phone } = req.body;
    try {
      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const updatedUser = await new UserServices().update(id, { name, email, phone });

      return res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async assignRole(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const { role } = req.body;
    try {
      if (!Object.values(RoleEnum).includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role. Must be one of: ${Object.values(RoleEnum).join(", ")}`,
        });
      }

      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const updatedUser = await new UserServices().update(id, { role });

      return res.status(200).json({
        success: true,
        message: `Role updated to '${role}' successfully`,
        data: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async deleteUser(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    try {
      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      await new UserServices().delete(id);

      return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async addAddress(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const addressData = req.body;

    if (req.user?.id !== id && req.user?.role !== RoleEnum.admin) {
      return res.status(403).json({ success: false, message: "You can only manage your own addresses" });
    }

    try {
      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const updatedUser = await new UserServices().addAddress(id, addressData);

      return res.status(201).json({ success: true, message: "Address added successfully", data: updatedUser });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async updateAddress(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const addressId = req.params.addressId as string;
    const addressData = req.body;

    if (req.user?.id !== id && req.user?.role !== RoleEnum.admin) {
      return res.status(403).json({ success: false, message: "You can only manage your own addresses" });
    }

    try {
      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const updatedUser = await new UserServices().updateAddress(id, addressId, addressData);
      if (!updatedUser) return res.status(404).json({ success: false, message: "Address not found" });

      return res.status(200).json({ success: true, message: "Address updated successfully", data: updatedUser });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  static async removeAddress(req: CustomRequestInterface, res: Response) {
    const id = req.params.id as string;
    const addressId = req.params.addressId as string;

    if (req.user?.id !== id && req.user?.role !== RoleEnum.admin) {
      return res.status(403).json({ success: false, message: "You can only manage your own addresses" });
    }

    try {
      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const updatedUser = await new UserServices().removeAddress(id, addressId);

      return res.status(200).json({ success: true, message: "Address removed successfully", data: updatedUser });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}