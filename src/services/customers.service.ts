import { getWooCollection } from "../api/woocommerce";
import type { WcCustomer, WcPaginatedResponse } from "../types/woocommerce";

export interface CustomerQuery {
  page?: number;
  per_page?: number;
  search?: string;
  orderby?: "id" | "include" | "name" | "registered_date";
  order?: "asc" | "desc";
}

export const CustomersService = {
  list(params: CustomerQuery = {}): Promise<WcPaginatedResponse<WcCustomer>> {
    return getWooCollection<WcCustomer>("/customers", params);
  },
};
