import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { formatCompact, formatCurrency } from "../../lib/utils";
import { useDashboardOverviewQuery } from "../../hooks/useWooQueries";
import { WooStatePanel } from "../ui/WooStatePanel";

interface MetricCard {
  id: string;
  title: string;
  value: number;
  delta: number;
  trend: "up" | "down";
  gradient: string;
  suffix?: "%";
  currency?: boolean;
}

function AnimatedMetricValue({ value, currency, suffix }: { value: number; currency?: boolean; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.05, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (latest) => {
      const text = currency
        ? formatCurrency(latest)
        : suffix
          ? `${latest.toFixed(0)}${suffix}`
          : formatCompact(latest);
      setDisplay(text);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [currency, motionValue, rounded, suffix, value]);

  return <>{display}</>;
}

export function KpiGrid() {
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const [tilt, setTilt] = useState<Record<string, { x: number; y: number }>>({});
  const { data, isLoading, error } = useDashboardOverviewQuery();

  if (isLoading || error || !data) {
    return <WooStatePanel loading={isLoading} error={error instanceof Error ? error.message : undefined} title="dashboard metrics" />;
  }

  const metrics: MetricCard[] = [
    {
      id: "revenue-month",
      title: "Monthly Revenue",
      value: data.monthlyRevenue,
      delta: data.yesterdayRevenue === 0 ? 0 : ((data.todayRevenue - data.yesterdayRevenue) / Math.max(data.yesterdayRevenue, 1)) * 100,
      trend: data.todayRevenue >= data.yesterdayRevenue ? "up" : "down",
      gradient: "from-blue-500 to-violet-500",
      currency: true,
    },
    {
      id: "orders-total",
      title: "Total Orders",
      value: data.totalOrders,
      delta: data.pendingOrders,
      trend: "up",
      gradient: "from-emerald-500 to-cyan-500",
    },
    {
      id: "aov",
      title: "Average Order Value",
      value: data.averageOrderValue,
      delta: data.completedOrders === 0 ? 0 : (data.completedOrders / Math.max(data.totalOrders, 1)) * 100,
      trend: "up",
      gradient: "from-indigo-500 to-purple-500",
      currency: true,
    },
    {
      id: "customers",
      title: "Customers",
      value: data.totalCustomers,
      delta: data.totalCoupons,
      trend: "up",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: "products",
      title: "Products",
      value: data.totalProducts,
      delta: data.lowStock,
      trend: data.lowStock > 0 ? "down" : "up",
      gradient: "from-pink-500 to-orange-500",
    },
    {
      id: "reviews",
      title: "Reviews",
      value: data.totalReviews,
      delta: data.totalCategories,
      trend: "up",
      gradient: "from-violet-500 to-fuchsia-500",
    },
  ];

  const handleMove = (id: string, event: React.MouseEvent<HTMLElement>) => {
    const element = refs.current[id];
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setTilt((state) => ({
      ...state,
      [id]: { x: (0.5 - py) * 8, y: (px - 0.5) * 10 },
    }));
  };

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric, index) => {
        const currentTilt = tilt[metric.id] ?? { x: 0, y: 0 };

        return (
          <motion.article
            key={metric.id}
            ref={(node) => {
              refs.current[metric.id] = node;
            }}
            onMouseMove={(event) => handleMove(metric.id, event)}
            onMouseLeave={() => setTilt((state) => ({ ...state, [metric.id]: { x: 0, y: 0 } }))}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.04 }}
            style={{ transformStyle: "preserve-3d", rotateX: currentTilt.x, rotateY: currentTilt.y }}
            className="glass depth-border soft-card hover-lift relative overflow-hidden rounded-3xl p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-slate-500">{metric.title}</p>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${metric.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {metric.trend === "up" ? <FiArrowUpRight /> : <FiArrowDownRight />} {Math.abs(metric.delta).toFixed(1)}
              </span>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">
              <AnimatedMetricValue value={metric.value} currency={metric.currency} suffix={metric.suffix} />
            </h3>
            <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${metric.gradient}`} />
          </motion.article>
        );
      })}
    </section>
  );
}
