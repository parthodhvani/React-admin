import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCommand, FiFileText, FiSearch, FiZap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuxiliaryCollectionsQuery, useCustomersQuery, useOrdersQuery, useProductsQuery } from "../../hooks/useWooQueries";
import { useDashboardStore } from "../../store/useDashboardStore";

type CommandItem = {
  id: string;
  label: string;
  subtitle: string;
  category: "Navigation" | "Quick Action" | "Orders" | "Products" | "Customers" | "Categories";
  action: () => void;
};

export function CommandPalette() {
  const navigate = useNavigate();
  const isOpen = useDashboardStore((state) => state.commandOpen);
  const close = useDashboardStore((state) => state.closeCommand);
  const addRecent = useDashboardStore((state) => state.addRecentSearch);
  const recentSearches = useDashboardStore((state) => state.recentSearches);
  const openQuickActions = useDashboardStore((state) => state.openQuickActions);
  const openNotifications = useDashboardStore((state) => state.openNotifications);
  const [query, setQuery] = useState("");

  const orders = useOrdersQuery({ per_page: 10, search: query || undefined });
  const products = useProductsQuery({ per_page: 10, search: query || undefined });
  const customers = useCustomersQuery({ per_page: 10, search: query || undefined });
  const aux = useAuxiliaryCollectionsQuery();

  const commands = useMemo<CommandItem[]>(() => {
    const navigation: CommandItem[] = [
      { id: "nav-overview", label: "Go to Overview", subtitle: "Main dashboard", category: "Navigation", action: () => navigate("/") },
      { id: "nav-orders", label: "Open Orders", subtitle: "Order management", category: "Navigation", action: () => navigate("/orders") },
      { id: "nav-products", label: "Open Products", subtitle: "Product catalog", category: "Navigation", action: () => navigate("/products") },
      { id: "nav-customers", label: "Open Customers", subtitle: "Customer management", category: "Navigation", action: () => navigate("/customers") },
      { id: "action-quick", label: "Create Quick Action", subtitle: "Open action composer", category: "Quick Action", action: () => openQuickActions() },
      { id: "action-notify", label: "Open Notifications", subtitle: "Review unread alerts", category: "Quick Action", action: () => openNotifications() },
    ];

    const dynamic: CommandItem[] = [
      ...(orders.data?.items ?? []).map((item) => ({
        id: `order-${item.id}`,
        label: `Order #${item.id}`,
        subtitle: `${item.status} • ${item.total}`,
        category: "Orders" as const,
        action: () => navigate("/orders"),
      })),
      ...(products.data?.items ?? []).map((item) => ({
        id: `product-${item.id}`,
        label: item.name,
        subtitle: `${item.stock_status} • ${item.price}`,
        category: "Products" as const,
        action: () => navigate("/products"),
      })),
      ...(customers.data?.items ?? []).map((item) => ({
        id: `customer-${item.id}`,
        label: `${item.first_name} ${item.last_name}`.trim() || item.email,
        subtitle: item.email,
        category: "Customers" as const,
        action: () => navigate("/customers"),
      })),
      ...(aux.data?.categories.items ?? []).slice(0, 8).map((item) => ({
        id: `category-${item.id}`,
        label: item.name,
        subtitle: `${item.count ?? 0} products`,
        category: "Categories" as const,
        action: () => navigate("/products"),
      })),
    ];

    return [...navigation, ...dynamic];
  }, [aux.data?.categories.items, customers.data?.items, navigate, openNotifications, openQuickActions, orders.data?.items, products.data?.items]);

  const results = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return commands;
    return commands.filter((item) => `${item.label} ${item.subtitle} ${item.category}`.toLowerCase().includes(keyword));
  }, [query, commands]);

  const onExecute = (item: CommandItem) => {
    addRecent(item.label);
    item.action();
    setQuery("");
    close();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ type: "spring", stiffness: 250, damping: 28 }} className="glass depth-border fixed left-1/2 top-[12vh] z-50 w-[min(760px,92vw)] -translate-x-1/2 rounded-[28px] p-4">
                <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2">
                  <FiSearch className="text-slate-500" />
                  <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders, products, customers, categories..." className="w-full bg-transparent text-sm text-slate-800 outline-none" />
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] text-slate-500"><FiCommand />K</span>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button key={item} onClick={() => setQuery(item)} className="rounded-full bg-white/70 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-white">{item}</button>
                  ))}
                </div>

                <div className="scrollbar-thin max-h-[52vh] overflow-auto rounded-2xl bg-white/55 p-2">
                  {results.length === 0 ? (
                    <div className="grid place-items-center py-10 text-center text-sm text-slate-500"><div><FiFileText className="mx-auto mb-2" />No result found for “{query}”.</div></div>
                  ) : (
                    <ul className="space-y-1">
                      {results.map((item) => (
                        <li key={item.id}>
                          <button onClick={() => onExecute(item)} className="group flex w-full items-center rounded-xl px-3 py-2 text-left transition hover:bg-white">
                            <span className="mr-3 rounded-lg bg-slate-100 p-2 text-slate-600">{item.category === "Quick Action" ? <FiZap /> : <FiArrowUpRight />}</span>
                            <span>
                              <span className="block text-sm font-medium text-slate-800">{item.label}</span>
                              <span className="text-xs text-slate-500">{item.subtitle}</span>
                            </span>
                            <span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-500">{item.category}</span>
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
