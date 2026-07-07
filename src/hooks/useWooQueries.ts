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
interface QueryOptions {
  enabled?: boolean;
}

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

export function useOrdersQuery(params: OrderQuery = {}, options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => OrdersService.list(params),
    enabled: enabled && (options.enabled ?? true),
    staleTime: 1000 * 30,
  });
}

export function useProductsQuery(params: ProductQuery = {}, options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => ProductsService.list(params),
    enabled: enabled && (options.enabled ?? true),
    staleTime: 1000 * 30,
  });
}

export function useCustomersQuery(params: CustomerQuery = {}, options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => CustomersService.list(params),
    enabled: enabled && (options.enabled ?? true),
    staleTime: 1000 * 30,
  });
}

export function useAuxiliaryCollectionsQuery(options: QueryOptions = {}) {
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
    enabled: enabled && (options.enabled ?? true),
    staleTime: 1000 * 60,
  });
}

export function useCategoriesQuery(options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesService.list(),
    enabled: enabled && (options.enabled ?? true),
    staleTime: 1000 * 60,
  });
}

export function useOperationsCollectionsQuery(options: QueryOptions = {}) {
  return useQuery({
    queryKey: ["operations-collections"],
    queryFn: async () => {
      const [categories, coupons] = await Promise.all([
        CategoriesService.list(),
        CouponsService.list(),
      ]);

      return { categories, coupons };
    },
    enabled: enabled && (options.enabled ?? true),
    staleTime: 1000 * 60,
  });
}

export function useApiConfigured() {
  return enabled;
}
