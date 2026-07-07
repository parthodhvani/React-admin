import { getWooCollection } from "../api/woocommerce";
import type { WcOrder, WcPaginatedResponse } from "../types/woocommerce";

export interface OrderQuery {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  customer?: number;
  after?: string;
  before?: string;
  orderby?: "date" | "id" | "include" | "title" | "slug";
  order?: "asc" | "desc";
}

export const OrdersService = {
  list(params: OrderQuery = {}): Promise<WcPaginatedResponse<WcOrder>> {
    return getWooCollection<WcOrder>("/orders", params);
  },
};
