import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useDashboardStore } from "../../store/useDashboardStore";

const actionTypes = [
  { value: "project", label: "Create Project" },
  { value: "task", label: "Create Task" },
  { value: "invite", label: "Invite User" },
  { value: "report", label: "Generate Report" },
] as const;

export function QuickActionsModal() {
  const isOpen = useDashboardStore((state) => state.quickActionsOpen);
  const close = useDashboardStore((state) => state.closeQuickActions);
  const submit = useDashboardStore((state) => state.submitQuickAction);

  const [type, setType] = useState<(typeof actionTypes)[number]["value"]>("project");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;

    submit({ type, title: title.trim(), note: note.trim() });
    setTitle("");
    setNote("");
    setType("project");
  };

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
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="glass fixed left-1/2 top-1/2 z-50 w-[min(520px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-[28px] p-5"
              >
                <header className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                  <button
                    onClick={close}
                    className="rounded-xl bg-white/70 p-2 text-slate-600 transition hover:bg-white"
                  >
                    <FiX />
                  </button>
                </header>

                <form onSubmit={onSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Action Type
                    </span>
                    <select
                      value={type}
                      onChange={(event) => setType(event.target.value as typeof type)}
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none"
                    >
                      {actionTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Title
                    </span>
                    <input
                      required
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g. Q3 Expansion Program"
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Note
                    </span>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Context, assignee, due date, and any extra details"
                      className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none"
                    />
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
                  >
                    <FiPlus /> Submit Action
                  </button>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
