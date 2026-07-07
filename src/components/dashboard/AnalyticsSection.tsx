import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useRevenueSeriesQuery,
  useStatusDistributionQuery,
  useTopProductsQuery,
} from "../../hooks/useWooQueries";
import { WooStatePanel } from "../ui/WooStatePanel";

export function AnalyticsSection() {
  const revenueQuery = useRevenueSeriesQuery();
  const statusQuery = useStatusDistributionQuery();
  const topProductsQuery = useTopProductsQuery();

  const loading = revenueQuery.isLoading || statusQuery.isLoading || topProductsQuery.isLoading;
  const error =
    (revenueQuery.error as Error | null)?.message ||
    (statusQuery.error as Error | null)?.message ||
    (topProductsQuery.error as Error | null)?.message;

  if (loading || error || !revenueQuery.data || !statusQuery.data || !topProductsQuery.data) {
    return <WooStatePanel loading={loading} error={error} title="analytics" />;
  }

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass soft-card rounded-3xl p-5 xl:col-span-2"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Revenue & Orders Trend</h2>
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
            live WooCommerce
          </span>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueQuery.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="glass soft-card rounded-3xl p-5"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Order Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusQuery.data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88}>
                {statusQuery.data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f97316", "#f43f5e"][index % 6]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5">
          {statusQuery.data.map((status) => (
            <div key={status.name} className="flex justify-between text-sm text-slate-600">
              <span>{status.name}</span>
              <span className="font-medium text-slate-800">{status.value}</span>
            </div>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass soft-card rounded-3xl p-5 xl:col-span-3"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Top Products by Sales</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProductsQuery.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.article>
    </section>
  );
}
