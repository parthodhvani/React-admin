export interface WcImage {
  id: number;
  src: string;
  alt: string;
}

export interface WcCategory {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export interface WcOrderLineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  subtotal: string;
  total: string;
}

export interface WcOrder {
  id: number;
  status: string;
  currency: string;
  total: string;
  total_tax: string;
  date_created: string;
  date_modified: string;
  payment_method: string;
  payment_method_title: string;
  customer_id: number;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    city: string;
    country: string;
  };
  line_items: WcOrderLineItem[];
}

export interface WcProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  type: string;
  status: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: "instock" | "outofstock" | "onbackorder";
  stock_quantity: number | null;
  average_rating: string;
  rating_count: number;
  total_sales: number;
  categories: WcCategory[];
  images: WcImage[];
  date_created: string;
}

export interface WcCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  avatar_url: string;
  billing: {
    phone: string;
    city: string;
    country: string;
  };
  date_created: string;
}

export interface WcCoupon {
  id: number;
  code: string;
  amount: string;
  discount_type: string;
  usage_count: number;
  date_created: string;
  date_expires: string | null;
}

export interface WcReview {
  id: number;
  product_id: number;
  reviewer: string;
  reviewer_email: string;
  review: string;
  rating: number;
  status: string;
  date_created: string;
}

export interface WcAttribute {
  id: number;
  name: string;
  slug: string;
  type: string;
  order_by: string;
  has_archives: boolean;
}

export interface WcTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WcVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_status: string;
}

export interface WcPaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  averageOrderValue: number;
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  totalCustomers: number;
  totalCoupons: number;
  totalCategories: number;
  totalReviews: number;
}

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
}

export interface TopProductPoint {
  name: string;
  sales: number;
}
