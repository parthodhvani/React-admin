import { AnalyticsSection } from "../components/dashboard/AnalyticsSection";
import { DataTableSection } from "../components/dashboard/DataTableSection";
import { HeroSection } from "../components/dashboard/HeroSection";
import { KpiGrid } from "../components/dashboard/KpiGrid";
import { OperationsPanel } from "../components/dashboard/OperationsPanel";

export function DashboardPage() {
  return (
    <div className="space-y-4">
      <HeroSection />
      <KpiGrid />
      <AnalyticsSection />
      <DataTableSection />
      <OperationsPanel />
    </div>
  );
}
