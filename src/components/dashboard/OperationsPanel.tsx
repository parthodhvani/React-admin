import { motion } from "framer-motion";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { financeSeries, notifications, projects, tasks } from "../../data/mockData";
import { formatCurrency } from "../../lib/utils";

export function OperationsPanel() {
  const [assistantPrompt, setAssistantPrompt] = useState(
    "Summarize churn risk by segment and generate retention actions.",
  );

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass soft-card rounded-3xl p-5"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Task Manager</h2>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-2xl bg-white/75 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.owner}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  {task.priority}
                </span>
              </div>
              <div className="mb-1 h-2 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{task.progress}%</span>
                <span>{task.deadline}</span>
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
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Projects & Budget</h2>
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-2xl bg-white/75 p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{project.name}</p>
                <span className="text-xs text-slate-500">{project.completion}%</span>
              </div>
              <p className="mb-2 text-xs text-slate-500">Due {project.dueDate}</p>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  style={{ width: `${project.completion}%` }}
                />
              </div>
              <p className="text-xs text-slate-600">
                Spent {formatCurrency(project.spent)} of {formatCurrency(project.budget)}
              </p>
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
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="rounded-2xl bg-white/75 p-3 transition hover:bg-white"
            >
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
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Financial Overview</h2>
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
          <button
            onClick={() => setAssistantPrompt("Forecast revenue by region for next quarter.")}
            className="w-full rounded-xl bg-white/80 px-3 py-2 text-left"
          >
            /forecast revenue next quarter
          </button>
          <button
            onClick={() => setAssistantPrompt("Generate board-ready PDF report with KPI variance.")}
            className="w-full rounded-xl bg-white/80 px-3 py-2 text-left"
          >
            /create board report PDF
          </button>
          <button
            onClick={() => setAssistantPrompt("List highest risk invoices and owners.")}
            className="w-full rounded-xl bg-white/80 px-3 py-2 text-left"
          >
            /show high-risk invoices
          </button>
        </div>
      </motion.article>
    </section>
  );
}
