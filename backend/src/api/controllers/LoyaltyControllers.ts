import { Response } from "express";
import { CustomRequestInterface } from "../../intefaces";
import { LoyaltyServices } from "../../services";

/**
 * The signed-in customer's loyalty position: tier, the cycle it is measured
 * in, the requirement checklist and the points balances. Everything is derived
 * server-side by `LoyaltyServices`, the same code the coupon gate reads, so
 * the level on this page and the level checked at checkout cannot drift apart.
 */
export class LoyaltyController {
  static async getSummary(req: CustomRequestInterface, res: Response) {
    const userId = req.user?.id as string;
    try {
      const summary = await new LoyaltyServices().evaluate(userId);
      return res.status(200).json({ success: true, data: summary });
    } catch (error) {
      console.error("LoyaltyController.getSummary error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
