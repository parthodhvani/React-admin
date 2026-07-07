import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="app-shell p-4 lg:p-4">
      <div className="mx-auto flex max-w-[1700px] gap-4">
        <Sidebar />
        <main className="w-full min-w-0 pb-6">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
