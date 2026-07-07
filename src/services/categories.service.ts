import { getWooCollection } from "../api/woocommerce";
import type { WcCategory, WcPaginatedResponse } from "../types/woocommerce";

export const CategoriesService = {
  list(): Promise<WcPaginatedResponse<WcCategory>> {
    return getWooCollection<WcCategory>("/products/categories", { per_page: 100 });
  },
};
