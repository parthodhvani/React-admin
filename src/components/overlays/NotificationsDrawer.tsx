import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { useMemo, useState } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";

export function NotificationsDrawer() {
  const isOpen = useDashboardStore((state) => state.notificationsOpen);
  const close = useDashboardStore((state) => state.closeNotifications);
  const notifications = useDashboardStore((state) => state.notifications);
  const markRead = useDashboardStore((state) => state.markNotificationRead);
  const clear = useDashboardStore((state) => state.clearNotification);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return notifications;

    return notifications.filter((item) =>
      `${item.title} ${item.message}`.toLowerCase().includes(term),
    );
  }, [notifications, query]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.aside
                initial={{ x: 48, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 48, opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
                className="glass fixed right-4 top-4 z-50 flex h-[calc(100vh-2rem)] w-[min(430px,96vw)] flex-col rounded-[28px] p-4"
              >
                <header className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
                  <button
                    onClick={close}
                    className="rounded-xl bg-white/70 p-2 text-slate-600 transition hover:bg-white"
                  >
                    <FiX />
                  </button>
                </header>

                <label className="mb-3 flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-slate-500">
                  <FiSearch />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search notifications"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </label>

                <div className="scrollbar-thin flex-1 space-y-2 overflow-auto pr-1">
                  {filtered.length === 0 ? (
                    <div className="grid h-full place-items-center rounded-2xl bg-white/55 text-center text-sm text-slate-500">
                      No notifications found.
                    </div>
                  ) : (
                    filtered.map((item) => (
                      <motion.article
                        layout
                        key={item.id}
                        className="rounded-2xl bg-white/75 p-3"
                      >
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.message}</p>
                          </div>
                          {item.unread && <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{item.time}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => markRead(item.id)}
                              className="rounded-lg bg-slate-100 px-2 py-1 hover:bg-slate-200"
                            >
                              <FiCheckCircle className="mr-1 inline" /> Read
                            </button>
                            <button
                              onClick={() => clear(item.id)}
                              className="rounded-lg bg-rose-100 px-2 py-1 text-rose-700 hover:bg-rose-200"
                            >
                              <FiTrash2 className="mr-1 inline" /> Delete
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    ))
                  )}
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
