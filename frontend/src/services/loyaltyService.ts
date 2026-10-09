import axiosInstance from "./axiosInstance";
import type { LoyaltySummary } from "../types/loyalty.types";

export const loyaltyService = {
  /**
   * The signed-in customer's tier, cycle, requirement checklist, points
   * balances and per-order counting labels. All derived server-side from
   * their order history.
   */
  getSummary: async (signal?: AbortSignal): Promise<LoyaltySummary> => {
    const { data } = await axiosInstance.get("/loyalty", { signal });
    return data.data;
  },
};
