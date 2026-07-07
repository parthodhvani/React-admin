import { create } from "zustand";
import { users as seededUsers } from "../data/mockData";
import type { User } from "../types";

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

type ThemeMode = "light" | "dark";

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
  userRecords: User[];
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
  setTheme: (theme: ThemeMode) => void;
  importUsers: (users: User[]) => void;
  resetUsers: () => void;
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

const storedTheme =
  typeof window !== "undefined"
    ? (localStorage.getItem("nova-theme") as ThemeMode | null)
    : null;

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarCollapsed: false,
  search: "",
  commandOpen: false,
  notificationsOpen: false,
  quickActionsOpen: false,
  recentSearches: ["Q2 MRR", "Helios project", "Active enterprise users"],
  notifications: seedNotifications,
  lastActionMessage: "",
  theme: storedTheme ?? "light",
  userRecords: seededUsers,

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
      ].slice(0, 20),
    })),

  clearActionMessage: () => set({ lastActionMessage: "" }),

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("nova-theme", next);
      return { theme: next };
    }),

  setTheme: (theme) => {
    localStorage.setItem("nova-theme", theme);
    set({ theme });
  },

  importUsers: (users) => {
    if (!users.length) return;
    set({ userRecords: users.slice(0, 500), lastActionMessage: `Imported ${users.length} user records.` });
  },

  resetUsers: () => set({ userRecords: seededUsers, lastActionMessage: "Reset users to seeded dataset." }),
}));
