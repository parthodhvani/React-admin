import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiHome,
  FiLogOut,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useDashboardStore } from "../../store/useDashboardStore";

const navItems = [
  { to: "/", label: "Overview", icon: FiHome },
  { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/projects", label: "Projects", icon: FiBriefcase },
  { to: "/team", label: "Team", icon: FiUsers },
  { to: "/calendar", label: "Calendar", icon: FiCalendar },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export function Sidebar() {
  const collapsed = useDashboardStore((state) => state.sidebarCollapsed);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 92 : 276 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="glass soft-card hidden h-[calc(100vh-2rem)] shrink-0 flex-col p-4 lg:flex"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500" />
        {!collapsed && (
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Nova</p>
            <p className="text-lg font-semibold text-slate-900">Executive OS</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const active =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
              )}
            >
              <item.icon className="text-lg" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && <FiChevronRight className="ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="glass soft-card mt-4 rounded-2xl p-3">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/80?img=21"
            alt="profile"
            className="h-10 w-10 rounded-full"
          />
          {!collapsed && (
            <>
              <div>
                <p className="text-sm font-semibold text-slate-800">Sophia Lin</p>
                <p className="text-xs text-slate-500">Chief Product Officer</p>
              </div>
              <button className="ml-auto rounded-xl p-2 text-slate-500 hover:bg-white/80">
                <FiLogOut />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
