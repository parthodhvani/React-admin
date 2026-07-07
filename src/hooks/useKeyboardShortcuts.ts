import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "../store/useDashboardStore";

export function useKeyboardShortcuts() {
  const openCommand = useDashboardStore((state) => state.openCommand);
  const openQuickActions = useDashboardStore((state) => state.openQuickActions);
  const closeCommand = useDashboardStore((state) => state.closeCommand);
  const commandOpen = useDashboardStore((state) => state.commandOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const lowerKey = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && lowerKey === "k") {
        event.preventDefault();
        openCommand();
      }

      if ((event.ctrlKey || event.metaKey) && lowerKey === "j") {
        event.preventDefault();
        openQuickActions();
      }

      if (event.shiftKey && lowerKey === "d") {
        navigate("/");
      }

      if (commandOpen && event.key === "Escape") {
        closeCommand();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openCommand, openQuickActions, commandOpen, closeCommand, navigate]);
}
