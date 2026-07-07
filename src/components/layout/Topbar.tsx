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
import { useDashboardStore } from "../../store/useDashboardStore";

export function Topbar() {
  const toggleSidebar = useDashboardStore((state) => state.toggleSidebar);
  const search = useDashboardStore((state) => state.search);
  const setSearch = useDashboardStore((state) => state.setSearch);

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

      <div className="ml-auto flex items-center gap-2">
        {[FiBell, FiMessageCircle, FiMoon, FiGlobe].map((Icon, index) => (
          <button
            key={index}
            className="rounded-2xl bg-white/70 p-2.5 text-slate-600 hover:bg-white"
          >
            <Icon />
          </button>
        ))}

        <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          <FiPlus /> Quick Action
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2">
            <img src="https://i.pravatar.cc/80?img=21" alt="profile" className="h-8 w-8 rounded-full" />
            <span className="text-sm font-medium text-slate-700">Sophia</span>
            <FiChevronDown className="text-slate-500" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="glass soft-card z-30 mt-2 min-w-[180px] rounded-2xl p-2">
              <DropdownMenu.Item className="rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-white/80">
                Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item className="rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-white/80">
                Preferences
              </DropdownMenu.Item>
              <DropdownMenu.Item className="rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-white/80">
                <FiCommand className="mr-2 inline" /> Keyboard shortcuts
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </motion.header>
  );
}
