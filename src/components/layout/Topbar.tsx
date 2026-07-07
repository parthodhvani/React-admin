import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import {
  FiBell,
  FiChevronDown,
  FiCommand,
  FiGlobe,
  FiMenu,
  FiMessageCircle,
  FiMoon,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "../../store/useDashboardStore";

export function Topbar() {
  const navigate = useNavigate();
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);
  const search = useDashboardStore((state) => state.search);
  const setSearch = useDashboardStore((state) => state.setSearch);
  const openCommand = useDashboardStore((state) => state.openCommand);
  const openQuickActions = useDashboardStore((state) => state.openQuickActions);
  const openNotifications = useDashboardStore((state) => state.openNotifications);
  const unreadCount = useDashboardStore(
    (state) => state.notifications.filter((item) => item.unread).length,
  );

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass soft-card sticky top-4 z-20 mb-6 flex flex-wrap items-center gap-3 rounded-3xl p-3"
    >
      <button
        onClick={toggleSidebar}
        className="rounded-2xl p-2 text-slate-600 transition hover:bg-white/80"
        aria-label="toggle sidebar"
      >
        <FiMenu />
      </button>

      <div className="relative min-w-[220px] flex-1">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search users, projects, metrics..."
          className="w-full rounded-2xl border border-white/80 bg-white/70 px-10 py-2.5 text-sm text-slate-700 outline-none ring-blue-200 transition focus:ring"
        />
      </div>

      <button
        onClick={openCommand}
        className="rounded-xl bg-white/75 px-2.5 py-2 text-xs text-slate-500 hover:bg-white"
      >
        Ctrl/⌘ K
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={openNotifications}
          className="relative rounded-2xl bg-white/70 p-2.5 text-slate-600 hover:bg-white"
        >
          <FiBell />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/team")}
          className="rounded-2xl bg-white/70 p-2.5 text-slate-600 hover:bg-white"
        >
          <FiMessageCircle />
        </button>

        {[FiMoon, FiGlobe].map((Icon, index) => (
          <button
            key={index}
            className="rounded-2xl bg-white/70 p-2.5 text-slate-600 hover:bg-white"
          >
            <Icon />
          </button>
        ))}

        <button
          onClick={openQuickActions}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          <FiPlus /> Quick Action
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2">
            <img src="https://i.pravatar.cc/80?img=21" alt="profile" className="h-8 w-8 rounded-full" />
            <span className="text-sm font-medium text-slate-700">Sophia</span>
            <FiChevronDown className="text-slate-500" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="glass soft-card z-30 mt-2 min-w-[200px] rounded-2xl p-2">
              <DropdownMenu.Item
                onClick={() => navigate("/settings")}
                className="rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-white/80"
              >
                Profile & Security
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={openQuickActions}
                className="rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-white/80"
              >
                Quick Actions
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={openCommand}
                className="rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-white/80"
              >
                <FiCommand className="mr-2 inline" /> Command Palette
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </motion.header>
  );
}
