import { useEffect } from "react";
import { useDashboardStore } from "../store/useDashboardStore";

export function useThemeSync() {
  const theme = useDashboardStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
}
