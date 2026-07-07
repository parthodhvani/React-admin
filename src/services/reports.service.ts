import { getWooCollection } from "../api/woocommerce";
import type {
  WcAttribute,
  WcPaginatedResponse,
  WcReview,
  WcTag,
} from "../types/woocommerce";

interface GenericReportPoint {
  date?: string;
  total_sales?: string;
  total_orders?: number;
}

export const ReportsService = {
  reviews(): Promise<WcPaginatedResponse<WcReview>> {
    return getWooCollection<WcReview>("/products/reviews", { per_page: 100 });
  },
  attributes(): Promise<WcPaginatedResponse<WcAttribute>> {
    return getWooCollection<WcAttribute>("/products/attributes", { per_page: 100 });
  },
  tags(): Promise<WcPaginatedResponse<WcTag>> {
    return getWooCollection<WcTag>("/products/tags", { per_page: 100 });
  },
  salesByDate(): Promise<WcPaginatedResponse<GenericReportPoint>> {
    return getWooCollection<GenericReportPoint>("/reports/sales", { per_page: 100 });
  },
};
