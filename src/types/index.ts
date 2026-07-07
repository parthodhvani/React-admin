export type Trend = "up" | "down";

export interface KpiMetric {
  id: string;
  title: string;
  value: number;
  delta: number;
  trend: Trend;
  color: string;
  points: number[];
}

export interface ChartPoint {
  month: string;
  revenue: number;
  sales: number;
  users: number;
  profit: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  country: string;
  status: "Active" | "Idle" | "Offline";
  orders: number;
  revenue: number;
  avatar: string;
}

export interface TaskItem {
  id: string;
  title: string;
  owner: string;
  deadline: string;
  priority: "Low" | "Medium" | "High";
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  budget: number;
  spent: number;
  dueDate: string;
  completion: number;
  priority: "Low" | "Medium" | "Critical";
  team: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface FinancePoint {
  name: string;
  income: number;
  expenses: number;
}
