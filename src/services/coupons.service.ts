import { getWooCollection } from "../api/woocommerce";
import type { WcCoupon, WcPaginatedResponse } from "../types/woocommerce";

export const CouponsService = {
  list(): Promise<WcPaginatedResponse<WcCoupon>> {
    return getWooCollection<WcCoupon>("/coupons", { per_page: 100 });
  },
};
