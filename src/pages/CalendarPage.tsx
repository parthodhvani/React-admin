import { useOrdersQuery } from "../hooks/useWooQueries";
import { WooStatePanel } from "../components/ui/WooStatePanel";

export function CalendarPage() {
  const ordersQuery = useOrdersQuery({ per_page: 50, orderby: "date", order: "desc" });

  if (ordersQuery.isLoading || ordersQuery.error || !ordersQuery.data) {
    return <WooStatePanel loading={ordersQuery.isLoading} error={ordersQuery.error instanceof Error ? ordersQuery.error.message : undefined} title="calendar timeline" />;
  }

  return (
    <section className="glass soft-card rounded-3xl p-6">
      <h1 className="gradient-text text-3xl font-semibold">Order Timeline</h1>
      <p className="mt-2 text-slate-600">Live daily timeline generated from WooCommerce orders.</p>

      <div className="mt-6 space-y-3">
        {ordersQuery.data.items.slice(0, 12).map((order) => (
          <div key={order.id} className="rounded-2xl bg-white/70 p-3 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Order #{order.id}</p>
              <span className="capitalize text-slate-500">{order.status}</span>
            </div>
            <p className="text-xs text-slate-500">{new Date(order.date_created).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
