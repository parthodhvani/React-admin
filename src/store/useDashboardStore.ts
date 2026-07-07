import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface QuickActionPayload {
  type: "project" | "task" | "invite" | "report";
  title: string;
  note: string;
}

interface DashboardState {
  sidebarCollapsed: boolean;
  search: string;
  commandOpen: boolean;
  notificationsOpen: boolean;
  quickActionsOpen: boolean;
  recentSearches: string[];
  notifications: Notification[];
  lastActionMessage: string;
  theme: ThemeMode;
  toggleSidebar: () => void;
  setSearch: (query: string) => void;
  openCommand: () => void;
  closeCommand: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  openQuickActions: () => void;
  closeQuickActions: () => void;
  addRecentSearch: (query: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
  submitQuickAction: (payload: QuickActionPayload) => void;
  clearActionMessage: () => void;
  toggleTheme: () => void;
}

const seedNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "System Ready",
    message: "WooCommerce sync pipeline initialized.",
    time: "just now",
    unread: true,
  },
];

const storedTheme =
  typeof window !== "undefined"
    ? ((localStorage.getItem("nova-theme") as ThemeMode | null) ?? "light")
    : "light";

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarCollapsed: false,
  search: "",
  commandOpen: false,
  notificationsOpen: false,
  quickActionsOpen: false,
  recentSearches: ["orders", "products", "customers"],
  notifications: seedNotifications,
  lastActionMessage: "",
  theme: storedTheme,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSearch: (search) => set({ search }),
  openCommand: () => set({ commandOpen: true }),
  closeCommand: () => set({ commandOpen: false }),
  openNotifications: () => set({ notificationsOpen: true }),
  closeNotifications: () => set({ notificationsOpen: false }),
  openQuickActions: () => set({ quickActionsOpen: true }),
  closeQuickActions: () => set({ quickActionsOpen: false }),

  addRecentSearch: (query) =>
    set((state) => {
      const trimmed = query.trim();
      if (!trimmed) return state;
      const deduped = [trimmed, ...state.recentSearches.filter((item) => item !== trimmed)];
      return { recentSearches: deduped.slice(0, 6) };
    }),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, unread: false } : item,
      ),
    })),

  clearNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((item) => item.id !== id) })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, unread: false })),
    })),

  submitQuickAction: (payload) =>
    set((state) => ({
      quickActionsOpen: false,
      lastActionMessage: `${payload.type.toUpperCase()} created: ${payload.title}`,
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: `${payload.type.toUpperCase()} created`,
          message: `${payload.title}${payload.note ? ` — ${payload.note}` : ""}`,
          time: "just now",
          unread: true,
        },
        ...state.notifications,
      ].slice(0, 30),
    })),

  clearActionMessage: () => set({ lastActionMessage: "" }),

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("nova-theme", next);
      return { theme: next };
    }),
}));
