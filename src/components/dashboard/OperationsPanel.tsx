import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  useAuxiliaryCollectionsQuery,
  useOrdersQuery,
  useProductsQuery,
} from "../../hooks/useWooQueries";
import { formatCurrency } from "../../lib/utils";
import { useDashboardStore } from "../../store/useDashboardStore";
import { WooStatePanel } from "../ui/WooStatePanel";

export function OperationsPanel() {
  const [assistantPrompt, setAssistantPrompt] = useState(
    "Summarize current order pipeline and recommend actions.",
  );

  const notifications = useDashboardStore((state) => state.notifications);
  const ordersQuery = useOrdersQuery({ per_page: 12, orderby: "date", order: "desc" });
  const productsQuery = useProductsQuery({ per_page: 12, orderby: "date", order: "desc" });
  const auxQuery = useAuxiliaryCollectionsQuery();

  const loading = ordersQuery.isLoading || productsQuery.isLoading || auxQuery.isLoading;
  const error =
    (ordersQuery.error as Error | null)?.message ||
    (productsQuery.error as Error | null)?.message ||
    (auxQuery.error as Error | null)?.message;

  if (loading || error || !ordersQuery.data || !productsQuery.data || !auxQuery.data) {
    return <WooStatePanel loading={loading} error={error} title="operations" />;
  }

  const financeSeries = useMemo(
    () =>
      ordersQuery.data.items
        .slice()
        .reverse()
        .map((order) => ({
          name: new Date(order.date_created).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          income: Number(order.total),
          expenses: Math.max(0, Number(order.total) * 0.35),
        })),
    [ordersQuery.data.items],
  );

  const categories = auxQuery.data.categories.items.slice(0, 5);
  const coupons = auxQuery.data.coupons.items.slice(0, 5);

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass soft-card rounded-3xl p-5"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Orders</h2>
        <div className="space-y-3">
          {ordersQuery.data.items.slice(0, 4).map((order) => (
            <div key={order.id} className="rounded-2xl bg-white/75 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Order #{order.id}</p>
                  <p className="text-xs text-slate-500">{order.billing.first_name} {order.billing.last_name}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 capitalize">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{new Date(order.date_created).toLocaleDateString()}</span>
                <span>{formatCurrency(Number(order.total))}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass soft-card rounded-3xl p-5"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Top Categories & Coupons</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-2xl bg-white/75 p-3 text-sm">
              <div className="flex justify-between">
                <p className="font-semibold text-slate-800">{category.name}</p>
                <span className="text-slate-500">{category.count ?? 0} items</span>
              </div>
            </div>
          ))}
          {coupons.map((coupon) => (
            <div key={coupon.id} className="rounded-2xl bg-white/75 p-3 text-sm">
              <div className="flex justify-between">
                <p className="font-semibold text-slate-800">{coupon.code}</p>
                <span className="text-slate-500">{coupon.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass soft-card rounded-3xl p-5"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Notifications Center</h2>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification) => (
            <div key={notification.id} className="rounded-2xl bg-white/75 p-3 transition hover:bg-white">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                {notification.unread && <span className="h-2 w-2 rounded-full bg-blue-500" />}
              </div>
              <p className="text-xs text-slate-500">{notification.message}</p>
              <p className="mt-1 text-[11px] text-slate-400">{notification.time}</p>
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="glass soft-card rounded-3xl p-5 xl:col-span-2"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Financial Trend (Recent Orders)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financeSeries}>
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Area dataKey="income" stroke="#10b981" fill="url(#incomeFill)" strokeWidth={2} />
              <Area dataKey="expenses" stroke="#f97316" fill="url(#expenseFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass soft-card rounded-3xl p-5"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">AI Assistant</h2>
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 p-4 text-white">
          <p className="text-sm">Ask Nova AI</p>
          <p className="mt-2 text-sm text-blue-100">“{assistantPrompt}”</p>
        </div>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <button onClick={() => setAssistantPrompt("Summarize top selling products and restock risk.")} className="w-full rounded-xl bg-white/80 px-3 py-2 text-left">/top-products and stock risk</button>
          <button onClick={() => setAssistantPrompt("Show failed and pending orders from last 7 days.")} className="w-full rounded-xl bg-white/80 px-3 py-2 text-left">/order-status anomaly</button>
          <button onClick={() => setAssistantPrompt("Estimate revenue trajectory from recent order velocity.")} className="w-full rounded-xl bg-white/80 px-3 py-2 text-left">/revenue trajectory</button>
        </div>
      </motion.article>
    </section>
  );
}
