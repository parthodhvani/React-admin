import { parseISO } from "date-fns";
import { CategoriesService } from "./categories.service";
import { CouponsService } from "./coupons.service";
import { CustomersService } from "./customers.service";
import { OrdersService } from "./orders.service";
import { ProductsService } from "./products.service";
import { ReportsService } from "./reports.service";
import type {
  DashboardMetrics,
  RevenuePoint,
  StatusDistribution,
  TopProductPoint,
  WcOrder,
} from "../types/woocommerce";

function toAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function inRange(date: Date, start: Date, end: Date) {
  return date >= start && date <= end;
}

function sumRevenue(orders: WcOrder[]) {
  return orders.reduce((acc, order) => acc + toAmount(order.total), 0);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export const DashboardService = {
  async overview(): Promise<DashboardMetrics> {
    const [ordersRes, productsRes, customersRes, couponsRes, categoriesRes, reviewsRes] =
      await Promise.all([
        OrdersService.list({ per_page: 100 }),
        ProductsService.list({ per_page: 100 }),
        CustomersService.list({ per_page: 100 }),
        CouponsService.list(),
        CategoriesService.list(),
        ReportsService.reviews(),
      ]);

    const orders = ordersRes.items;
    const now = new Date();
    const todayStart = startOfToday();
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - 6);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const todayOrders = orders.filter((order) => {
      const date = parseISO(order.date_created);
      return inRange(date, todayStart, now);
    });

    const yesterdayOrders = orders.filter((order) => {
      const date = parseISO(order.date_created);
      return inRange(date, yesterdayStart, new Date(todayStart.getTime() - 1));
    });

    const weeklyOrders = orders.filter((order) => {
      const date = parseISO(order.date_created);
      return inRange(date, weekStart, now);
    });

    const monthlyOrders = orders.filter((order) => {
      const date = parseISO(order.date_created);
      return inRange(date, monthStart, now);
    });

    const yearlyOrders = orders.filter((order) => {
      const date = parseISO(order.date_created);
      return inRange(date, yearStart, now);
    });

    const completedOrders = orders.filter((order) => order.status === "completed");
    const pendingOrders = orders.filter((order) => order.status === "pending");
    const cancelledOrders = orders.filter((order) => order.status === "cancelled");
    const refundedOrders = orders.filter((order) => order.status === "refunded");

    const totalRevenue = sumRevenue(completedOrders);

    return {
      totalRevenue,
      todayRevenue: sumRevenue(todayOrders),
      yesterdayRevenue: sumRevenue(yesterdayOrders),
      weeklyRevenue: sumRevenue(weeklyOrders),
      monthlyRevenue: sumRevenue(monthlyOrders),
      yearlyRevenue: sumRevenue(yearlyOrders),
      totalOrders: orders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      refundedOrders: refundedOrders.length,
      averageOrderValue: completedOrders.length ? totalRevenue / completedOrders.length : 0,
      totalProducts: productsRes.total,
      lowStock: productsRes.items.filter((item) => (item.stock_quantity ?? 0) > 0 && (item.stock_quantity ?? 0) <= 5).length,
      outOfStock: productsRes.items.filter((item) => item.stock_status === "outofstock").length,
      totalCustomers: customersRes.total,
      totalCoupons: couponsRes.total,
      totalCategories: categoriesRes.total,
      totalReviews: reviewsRes.total,
    };
  },

  async revenueSeries(): Promise<RevenuePoint[]> {
    const orders = (await OrdersService.list({ per_page: 100 })).items;

    const bucket = new Map<string, { revenue: number; orders: number }>();

    for (const order of orders) {
      const date = parseISO(order.date_created);
      const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const existing = bucket.get(label) ?? { revenue: 0, orders: 0 };
      existing.revenue += toAmount(order.total);
      existing.orders += 1;
      bucket.set(label, existing);
    }

    return [...bucket.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, value]) => ({ label, revenue: value.revenue, orders: value.orders }));
  },

  async orderStatusDistribution(): Promise<StatusDistribution[]> {
    const orders = (await OrdersService.list({ per_page: 100 })).items;
    const map = new Map<string, number>();

    for (const order of orders) {
      map.set(order.status, (map.get(order.status) ?? 0) + 1);
    }

    return [...map.entries()].map(([name, value]) => ({ name, value }));
  },

  async topProducts(): Promise<TopProductPoint[]> {
    const products = (await ProductsService.list({ per_page: 100 })).items;
    return products
      .sort((a, b) => b.total_sales - a.total_sales)
      .slice(0, 8)
      .map((product) => ({ name: product.name, sales: product.total_sales }));
  },
};
