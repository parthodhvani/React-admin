import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCommand, FiFileText, FiSearch, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { users } from "../../data/mockData";
import { useDashboardStore } from "../../store/useDashboardStore";

type CommandItem = {
  id: string;
  label: string;
  subtitle: string;
  category: "Navigation" | "Quick Action" | "People";
  action: () => void;
};

export function CommandPalette() {
  const navigate = useNavigate();
  const isOpen = useDashboardStore((state) => state.commandOpen);
  const close = useDashboardStore((state) => state.closeCommand);
  const addRecent = useDashboardStore((state) => state.addRecentSearch);
  const recentSearches = useDashboardStore((state) => state.recentSearches);
  const openQuickActions = useDashboardStore((state) => state.openQuickActions);
  const [query, setQuery] = useState("");

  const commands = useMemo<CommandItem[]>(
    () => [
      {
        id: "nav-overview",
        label: "Go to Overview",
        subtitle: "Navigate to dashboard home",
        category: "Navigation",
        action: () => navigate("/"),
      },
      {
        id: "nav-analytics",
        label: "Open Analytics",
        subtitle: "Revenue, users, and growth insights",
        category: "Navigation",
        action: () => navigate("/analytics"),
      },
      {
        id: "nav-team",
        label: "Open Team Directory",
        subtitle: "Users and performance table",
        category: "Navigation",
        action: () => navigate("/team"),
      },
      {
        id: "action-quick",
        label: "Create Quick Action",
        subtitle: "Open action composer (Ctrl/Cmd + J)",
        category: "Quick Action",
        action: () => openQuickActions(),
      },
      ...users.slice(0, 12).map((user) => ({
        id: `user-${user.id}`,
        label: user.name,
        subtitle: `${user.role} • ${user.country}`,
        category: "People" as const,
        action: () => {
          navigate("/team");
        },
      })),
    ],
    [navigate, openQuickActions],
  );

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return commands;

    return commands.filter((item) =>
      `${item.label} ${item.subtitle} ${item.category}`.toLowerCase().includes(keyword),
    );
  }, [query, commands]);

  const onExecute = (item: CommandItem) => {
    addRecent(item.label);
    item.action();
    setQuery("");
    close();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setQuery("");
          close();
        }
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250, damping: 28 }}
                className="glass depth-border fixed left-1/2 top-[12vh] z-50 w-[min(720px,92vw)] -translate-x-1/2 rounded-[28px] p-4"
              >
                <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2">
                  <FiSearch className="text-slate-500" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search pages, people, actions..."
                    className="w-full bg-transparent text-sm text-slate-800 outline-none"
                  />
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-500">
                    <FiCommand />K
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-white"
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="scrollbar-thin max-h-[52vh] overflow-auto rounded-2xl bg-white/55 p-2">
                  {results.length === 0 ? (
                    <div className="grid place-items-center py-10 text-center text-sm text-slate-500">
                      <div>
                        <FiFileText className="mx-auto mb-2" />
                        No result found for “{query}”.
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {results.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => onExecute(item)}
                            className="group flex w-full items-center rounded-xl px-3 py-2 text-left transition hover:bg-white"
                          >
                            <span className="mr-3 rounded-lg bg-slate-100 p-2 text-slate-600">
                              {item.category === "Quick Action" ? <FiZap /> : <FiArrowUpRight />}
                            </span>
                            <span>
                              <span className="block text-sm font-medium text-slate-800">{item.label}</span>
                              <span className="text-xs text-slate-500">{item.subtitle}</span>
                            </span>
                            <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-500">
                              {item.category}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
