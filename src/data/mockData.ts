import type {
  ChartPoint,
  FinancePoint,
  KpiMetric,
  NotificationItem,
  Project,
  TaskItem,
  User,
} from "../types";

const firstNames = [
  "Ava",
  "Noah",
  "Liam",
  "Olivia",
  "Ethan",
  "Emma",
  "Mason",
  "Isabella",
  "Lucas",
  "Mia",
];

const lastNames = [
  "Parker",
  "Mitchell",
  "Kim",
  "Walker",
  "Patel",
  "Chen",
  "Garcia",
  "Shah",
  "Brown",
  "Singh",
];

const countries = [
  "United States",
  "Canada",
  "Germany",
  "India",
  "Japan",
  "United Kingdom",
  "Australia",
  "Brazil",
  "Singapore",
  "France",
];

const roles = ["Admin", "Manager", "Analyst", "Support", "Engineer"];

export const kpiMetrics: KpiMetric[] = [
  {
    id: "users",
    title: "Total Users",
    value: 148220,
    delta: 14.2,
    trend: "up",
    color: "from-blue-500/90 to-cyan-400/90",
    points: [22, 24, 26, 28, 30, 32, 35],
  },
  {
    id: "revenue",
    title: "Revenue",
    value: 3900000,
    delta: 11.1,
    trend: "up",
    color: "from-violet-500/90 to-fuchsia-400/90",
    points: [14, 18, 17, 20, 25, 27, 31],
  },
  {
    id: "orders",
    title: "Orders",
    value: 48640,
    delta: 7.8,
    trend: "up",
    color: "from-emerald-500/90 to-teal-400/90",
    points: [30, 28, 31, 33, 36, 34, 39],
  },
  {
    id: "conversions",
    title: "Conversions",
    value: 68.4,
    delta: -1.2,
    trend: "down",
    color: "from-pink-500/90 to-orange-400/90",
    points: [70, 69, 68, 71, 69, 68, 67],
  },
  {
    id: "sessions",
    title: "Active Sessions",
    value: 12940,
    delta: 5.4,
    trend: "up",
    color: "from-cyan-500/90 to-blue-400/90",
    points: [9, 10, 11, 12, 13, 12, 14],
  },
  {
    id: "profit",
    title: "Profit",
    value: 1260000,
    delta: 8.1,
    trend: "up",
    color: "from-indigo-500/90 to-purple-400/90",
    points: [12, 12, 13, 15, 16, 17, 18],
  },
];

export const analyticsSeries: ChartPoint[] = [
  { month: "Jan", revenue: 210, sales: 120, users: 32, profit: 98 },
  { month: "Feb", revenue: 240, sales: 135, users: 35, profit: 108 },
  { month: "Mar", revenue: 265, sales: 150, users: 39, profit: 122 },
  { month: "Apr", revenue: 280, sales: 162, users: 43, profit: 133 },
  { month: "May", revenue: 310, sales: 170, users: 47, profit: 149 },
  { month: "Jun", revenue: 335, sales: 185, users: 50, profit: 160 },
  { month: "Jul", revenue: 350, sales: 192, users: 53, profit: 172 },
  { month: "Aug", revenue: 372, sales: 208, users: 58, profit: 184 },
  { month: "Sep", revenue: 390, sales: 224, users: 61, profit: 198 },
  { month: "Oct", revenue: 420, sales: 239, users: 66, profit: 214 },
  { month: "Nov", revenue: 442, sales: 247, users: 72, profit: 226 },
  { month: "Dec", revenue: 468, sales: 262, users: 76, profit: 244 },
];

export const financeSeries: FinancePoint[] = [
  { name: "Q1", income: 800, expenses: 420 },
  { name: "Q2", income: 920, expenses: 450 },
  { name: "Q3", income: 1080, expenses: 510 },
  { name: "Q4", income: 1220, expenses: 560 },
];

export const users: User[] = Array.from({ length: 120 }, (_, index) => {
  const first = firstNames[index % firstNames.length];
  const last = lastNames[(index * 3) % lastNames.length];

  return {
    id: `USR-${(index + 1).toString().padStart(4, "0")}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${index + 1}@nova-suite.ai`,
    role: roles[index % roles.length],
    country: countries[index % countries.length],
    status: index % 4 === 0 ? "Idle" : index % 7 === 0 ? "Offline" : "Active",
    orders: 10 + (index % 37),
    revenue: 1200 + index * 78,
    avatar: `https://i.pravatar.cc/100?img=${(index % 70) + 1}`,
  };
});

export const tasks: TaskItem[] = [
  {
    id: "TSK-201",
    title: "Deploy predictive analytics model",
    owner: "Ava Parker",
    deadline: "2026-07-20",
    priority: "High",
    progress: 76,
  },
  {
    id: "TSK-202",
    title: "Refine onboarding conversion flow",
    owner: "Noah Mitchell",
    deadline: "2026-07-14",
    priority: "Medium",
    progress: 52,
  },
  {
    id: "TSK-203",
    title: "Migrate invoices to v3 schema",
    owner: "Emma Chen",
    deadline: "2026-07-24",
    priority: "High",
    progress: 41,
  },
  {
    id: "TSK-204",
    title: "Create enterprise onboarding webinars",
    owner: "Liam Singh",
    deadline: "2026-07-30",
    priority: "Low",
    progress: 63,
  },
];

export const projects: Project[] = [
  {
    id: "PRJ-110",
    name: "Helios Revenue Intelligence",
    budget: 480000,
    spent: 302000,
    dueDate: "2026-10-12",
    completion: 72,
    priority: "Critical",
    team: ["Ava", "Noah", "Emma", "Liam"],
  },
  {
    id: "PRJ-111",
    name: "Orion Customer Graph",
    budget: 340000,
    spent: 188000,
    dueDate: "2026-09-04",
    completion: 58,
    priority: "Medium",
    team: ["Mia", "Lucas", "Olivia"],
  },
  {
    id: "PRJ-112",
    name: "Nova Global Billing",
    budget: 620000,
    spent: 455000,
    dueDate: "2026-12-16",
    completion: 83,
    priority: "Critical",
    team: ["Ethan", "Isabella", "Mason", "Noah"],
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "NT-1",
    title: "Quarterly report generated",
    message: "Q2 Board-ready report is available for download.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "NT-2",
    title: "Invoice #4528 paid",
    message: "Enterprise payment received from Alpine Systems.",
    time: "18m ago",
    unread: true,
  },
  {
    id: "NT-3",
    title: "Security alert",
    message: "2FA was enabled for 14 team members.",
    time: "45m ago",
    unread: false,
  },
  {
    id: "NT-4",
    title: "Model retraining complete",
    message: "Forecasting pipeline accuracy improved by 2.4%.",
    time: "1h ago",
    unread: false,
  },
];

export const activities = Array.from({ length: 110 }, (_, index) => ({
  id: `ACT-${index + 1}`,
  title: `Activity event ${index + 1}`,
  description: "Automated enterprise workflow update processed.",
  country: countries[index % countries.length],
  value: 2000 + index * 75,
}));
