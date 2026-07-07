import { create } from "zustand";

interface DashboardState {
  sidebarCollapsed: boolean;
  search: string;
  toggleSidebar: () => void;
  setSearch: (query: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  sidebarCollapsed: false,
  search: "",
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSearch: (search) => set({ search }),
}));
