import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CommandPalette } from "../overlays/CommandPalette";
import { NotificationsDrawer } from "../overlays/NotificationsDrawer";
import { QuickActionsModal } from "../overlays/QuickActionsModal";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useDashboardStore } from "../../store/useDashboardStore";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const location = useLocation();
  const lastActionMessage = useDashboardStore((state) => state.lastActionMessage);
  const clearActionMessage = useDashboardStore((state) => state.clearActionMessage);

  useKeyboardShortcuts();

  useEffect(() => {
    if (!lastActionMessage) return;
    const timer = window.setTimeout(() => clearActionMessage(), 2800);
    return () => window.clearTimeout(timer);
  }, [lastActionMessage, clearActionMessage]);

  return (
    <div className="app-shell p-4 lg:p-4">
      <div className="mx-auto flex max-w-[1720px] gap-4">
        <Sidebar />

        <main className="w-full min-w-0 pb-6">
          <Topbar />

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.28 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette />
      <NotificationsDrawer />
      <QuickActionsModal />

      <AnimatePresence>
        {lastActionMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            className="glass fixed bottom-6 right-6 z-50 rounded-2xl px-4 py-2 text-sm font-medium text-slate-700"
          >
            {lastActionMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
