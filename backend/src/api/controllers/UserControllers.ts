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

    // Same owner-or-admin rule as getUserById and the address handlers.
    // Without it, any authenticated user could rewrite anyone's profile
    // (including swapping the admin's email for a password-reset takeover).
    if (req.user?.id !== id && req.user?.role !== RoleEnum.admin) {
      return res.status(403).json({ success: false, message: "You can only update your own profile" });
    }

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

      // Single-vendor platform: admin is provisioned by the operator
      // (seeder / DB), never promoted from the dashboard. Reject it here even
      // though the validator would technically accept the value.
      if (role === RoleEnum.admin) {
        return res.status(403).json({
          success: false,
          message: "Admin role cannot be assigned. Admin access is provisioned by the platform operator.",
        });
      }

      // Nobody may change their own role — otherwise the only admin could
      // demote themselves and lock the whole panel. The UI hides this too,
      // but the API is the source of truth.
      if (req.user?.id === id) {
        return res.status(403).json({ success: false, message: "You cannot change your own role" });
      }

      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // Demoting the final admin would leave no way back into the panel.
      if (user.role === RoleEnum.admin && role === RoleEnum.customer) {
        const adminCount = await new UserServices().countByRole(RoleEnum.admin);
        if (adminCount <= 1) {
          return res.status(409).json({
            success: false,
            message: "Cannot demote the last admin account — the admin panel would become inaccessible.",
          });
        }
      }

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
      // The UI already disables self-delete; enforce it on the API too.
      if (req.user?.id === id) {
        return res.status(403).json({ success: false, message: "You cannot delete your own account" });
      }

      const user = await new UserServices().findById(id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // Deleting the final admin would permanently lock the admin panel.
      if (user.role === RoleEnum.admin) {
        const adminCount = await new UserServices().countByRole(RoleEnum.admin);
        if (adminCount <= 1) {
          return res.status(409).json({
            success: false,
            message: "Cannot delete the last admin account — the admin panel would become inaccessible.",
          });
        }
      }

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