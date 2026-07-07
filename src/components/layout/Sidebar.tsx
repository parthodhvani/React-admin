import { motion } from "framer-motion";
import {
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiChevronRight,
  FiHome,
  FiLogOut,
  FiSettings,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/useAuthStore";
import { useDashboardStore } from "../../store/useDashboardStore";

const navItems = [
  { to: "/", label: "Overview", icon: FiHome },
  { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/projects", label: "Projects", icon: FiBriefcase },
  { to: "/team", label: "Team", icon: FiUsers },
  { to: "/calendar", label: "Calendar", icon: FiCalendar },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

const pinned = ["Helios Revenue", "Q3 GTM Plan", "Enterprise Team Ops"];

export function Sidebar() {
  const collapsed = useDashboardStore((state) => state.sidebarCollapsed);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 96 : 296 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="glass soft-card hidden h-[calc(100vh-2rem)] shrink-0 flex-col p-4 lg:flex"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg">
          <span className="glow-orb absolute -right-2 -top-2 h-5 w-5 bg-cyan-400" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Workspace</p>
            <p className="text-lg font-semibold text-slate-900">Nova Executive OS</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="mb-5 rounded-2xl bg-white/70 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Current Space</p>
          <p className="text-sm font-semibold text-slate-800">Revenue Intelligence</p>
          <p className="text-xs text-slate-500">24 members online</p>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1.5">
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
                "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/75 hover:text-slate-900",
              )}
            >
              {!collapsed && active && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute inset-y-1 left-1 w-1 rounded-full bg-white/70"
                />
              )}
              <item.icon className="text-lg" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && <FiChevronRight className="ml-auto opacity-50" />}
            </Link>
          );
        })}

        {!collapsed && (
          <div className="mt-3 space-y-2">
            <p className="px-2 text-[11px] uppercase tracking-wide text-slate-500">Pinned</p>
            {pinned.map((item) => (
              <button
                key={item}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs text-slate-600 transition hover:bg-white/70"
              >
                <FiStar className="text-amber-500" />
                {item}
              </button>
            ))}
          </div>
        )}
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
              <button
                onClick={logout}
                className="ml-auto rounded-xl p-2 text-slate-500 hover:bg-white/80"
              >
                <FiLogOut />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
