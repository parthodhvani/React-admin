import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { kpiMetrics } from "../../data/mockData";
import { formatCompact, formatCurrency } from "../../lib/utils";

function displayMetric(title: string, value: number) {
  if (title === "Revenue" || title === "Profit") return formatCurrency(value);
  if (title === "Conversions") return `${value.toFixed(1)}%`;
  return formatCompact(value);
}

function AnimatedMetricValue({ title, value }: { title: string; value: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(displayMetric(title, value));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.15, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (latest) => {
      const numeric = title === "Conversions" ? latest / 10 : latest;
      setDisplay(displayMetric(title, numeric));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [motionValue, rounded, title, value]);

  return <>{display}</>;
}

export function KpiGrid() {
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const [tilt, setTilt] = useState<Record<string, { x: number; y: number }>>({});

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

  const handleLeave = (id: string) => {
    setTilt((state) => ({ ...state, [id]: { x: 0, y: 0 } }));
  };

  const chartDataMap = useMemo(
    () =>
      Object.fromEntries(
        kpiMetrics.map((metric) => [
          metric.id,
          metric.points.map((value, valueIndex) => ({ value, name: valueIndex })),
        ]),
      ),
    [],
  );

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {kpiMetrics.map((metric, index) => {
        const currentTilt = tilt[metric.id] ?? { x: 0, y: 0 };

        return (
          <motion.article
            key={metric.id}
            ref={(node) => {
              refs.current[metric.id] = node;
            }}
            onMouseMove={(event) => handleMove(metric.id, event)}
            onMouseLeave={() => handleLeave(metric.id)}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            style={{
              transformStyle: "preserve-3d",
              rotateX: currentTilt.x,
              rotateY: currentTilt.y,
            }}
            className="glass depth-border soft-card hover-lift relative overflow-hidden rounded-3xl p-5"
          >
            <span className="glow-orb absolute -left-6 top-4 h-20 w-20 bg-blue-300" />
            <span className="glow-orb absolute -bottom-8 right-2 h-20 w-20 bg-violet-300" />

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
              <AnimatedMetricValue title={metric.title} value={metric.title === "Conversions" ? metric.value * 10 : metric.value} />
            </h3>

            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataMap[metric.id]}>
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
                    isAnimationActive
                    animationDuration={1100}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={`mt-4 h-1.5 rounded-full bg-gradient-to-r ${metric.color}`} />
          </motion.article>
        );
      })}
    </section>
  );
}
