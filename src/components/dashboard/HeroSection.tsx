import { motion } from "framer-motion";
import { FiCloud, FiSun } from "react-icons/fi";

const now = new Date();
const dateLabel = now.toLocaleDateString("en-US", {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-500 p-6 text-white shadow-xl"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-cyan-200/30 blur-2xl" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-sm text-blue-100">{dateLabel}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, Sophia.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-blue-50 sm:text-base">
            Your enterprise cloud stack is healthy and growing. Keep the momentum—today is perfect for launching the next high-impact initiative.
          </p>
        </div>

        <div className="glass soft-card rounded-3xl p-4 text-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-xl bg-sky-100 p-2 text-sky-600">
              <FiSun />
            </span>
            <span className="rounded-xl bg-slate-100 p-2 text-slate-600">
              <FiCloud />
            </span>
          </div>
          <p className="text-sm text-slate-500">San Francisco</p>
          <p className="text-2xl font-semibold">24°C</p>
          <p className="text-sm text-slate-500">Partly Cloudy • AQI 38</p>
        </div>
      </div>
    </motion.section>
  );
}
