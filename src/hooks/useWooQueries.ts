import { useQuery } from "@tanstack/react-query";
import { wooEnv } from "../config/env";
import { CategoriesService } from "../services/categories.service";
import { CouponsService } from "../services/coupons.service";
import { CustomersService, type CustomerQuery } from "../services/customers.service";
import { DashboardService } from "../services/dashboard.service";
import { OrdersService, type OrderQuery } from "../services/orders.service";
import { ProductsService, type ProductQuery } from "../services/products.service";
import { ReportsService } from "../services/reports.service";

const enabled = wooEnv.isConfigured;

export function useDashboardOverviewQuery() {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => DashboardService.overview(),
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useRevenueSeriesQuery() {
  return useQuery({
    queryKey: ["dashboard-revenue-series"],
    queryFn: () => DashboardService.revenueSeries(),
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useStatusDistributionQuery() {
  return useQuery({
    queryKey: ["dashboard-status-distribution"],
    queryFn: () => DashboardService.orderStatusDistribution(),
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useTopProductsQuery() {
  return useQuery({
    queryKey: ["dashboard-top-products"],
    queryFn: () => DashboardService.topProducts(),
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useOrdersQuery(params: OrderQuery = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => OrdersService.list(params),
    enabled,
    staleTime: 1000 * 30,
  });
}

export function useProductsQuery(params: ProductQuery = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => ProductsService.list(params),
    enabled,
    staleTime: 1000 * 30,
  });
}

export function useCustomersQuery(params: CustomerQuery = {}) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => CustomersService.list(params),
    enabled,
    staleTime: 1000 * 30,
  });
}

export function useAuxiliaryCollectionsQuery() {
  return useQuery({
    queryKey: ["aux-collections"],
    queryFn: async () => {
      const [categories, coupons, reviews, tags, attributes] = await Promise.all([
        CategoriesService.list(),
        CouponsService.list(),
        ReportsService.reviews(),
        ReportsService.tags(),
        ReportsService.attributes(),
      ]);

      return { categories, coupons, reviews, tags, attributes };
    },
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useApiConfigured() {
  return enabled;
}
