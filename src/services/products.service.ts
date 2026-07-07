import { getWooCollection } from "../api/woocommerce";
import type { WcPaginatedResponse, WcProduct, WcVariation } from "../types/woocommerce";

export interface ProductQuery {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  category?: number;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  orderby?: "date" | "id" | "include" | "title" | "slug" | "price";
  order?: "asc" | "desc";
}

export const ProductsService = {
  list(params: ProductQuery = {}): Promise<WcPaginatedResponse<WcProduct>> {
    return getWooCollection<WcProduct>("/products", params);
  },
  variations(productId: number): Promise<WcPaginatedResponse<WcVariation>> {
    return getWooCollection<WcVariation>(`/products/${productId}/variations`);
  },
};
