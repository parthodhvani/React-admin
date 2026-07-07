import { create } from "zustand";

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
  submitQuickAction: (payload: QuickActionPayload) => void;
  clearActionMessage: () => void;
}

const seedNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Forecast model retrained",
    message: "Revenue forecast confidence increased by 3.2%.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "notif-2",
    title: "New enterprise lead",
    message: "Apex Dynamics requested a custom demo.",
    time: "14m ago",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Invoice processed",
    message: "Invoice #5932 was paid via ACH transfer.",
    time: "1h ago",
    unread: false,
  },
];

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarCollapsed: false,
  search: "",
  commandOpen: false,
  notificationsOpen: false,
  quickActionsOpen: false,
  recentSearches: ["Q2 MRR", "Helios project", "Active enterprise users"],
  notifications: seedNotifications,
  lastActionMessage: "",

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

  submitQuickAction: (payload) =>
    set(() => ({
      quickActionsOpen: false,
      lastActionMessage: `${payload.type.toUpperCase()} created: ${payload.title}`,
    })),

  clearActionMessage: () => set({ lastActionMessage: "" }),
}));
