import { motion } from "framer-motion";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { kpiMetrics } from "../../data/mockData";
import { formatCompact, formatCurrency } from "../../lib/utils";

function MetricValue(title: string, value: number) {
  if (title === "Revenue" || title === "Profit") {
    return formatCurrency(value);
  }

  if (title === "Conversions") {
    return `${value.toFixed(1)}%`;
  }

  return formatCompact(value);
}

export function KpiGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {kpiMetrics.map((metric, index) => (
        <motion.article
          key={metric.id}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ rotateX: 2.5, rotateY: -2.5, y: -6 }}
          className="glass soft-card hover-lift overflow-hidden rounded-3xl p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">{metric.title}</p>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                metric.trend === "up"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {metric.trend === "up" ? <FiArrowUpRight /> : <FiArrowDownRight />} {Math.abs(metric.delta)}%
            </span>
          </div>

          <h3 className="text-2xl font-semibold text-slate-900">
            {MetricValue(metric.title, metric.value)}
          </h3>

          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={metric.points.map((value, valueIndex) => ({
                  value,
                  name: valueIndex,
                }))}
              >
                <defs>
                  <linearGradient id={metric.id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.65} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  fill={`url(#${metric.id})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${metric.color}`} />
        </motion.article>
      ))}
    </section>
  );
}
