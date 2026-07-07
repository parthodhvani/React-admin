import { useMemo, useState } from "react";
import { useCustomersQuery, useOrdersQuery } from "../../hooks/useWooQueries";
import { formatCurrency } from "../../lib/utils";
import { WooStatePanel } from "../ui/WooStatePanel";

export function CustomersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const customersQuery = useCustomersQuery({ page, per_page: 15, search: search || undefined });
  const ordersQuery = useOrdersQuery({ per_page: 100 });

  if (customersQuery.isLoading || ordersQuery.isLoading || customersQuery.error || ordersQuery.error || !customersQuery.data || !ordersQuery.data) {
    return (
      <WooStatePanel
        loading={customersQuery.isLoading || ordersQuery.isLoading}
        error={(customersQuery.error as Error | null)?.message || (ordersQuery.error as Error | null)?.message}
        title="customers"
      />
    );
  }

  const metrics = useMemo(() => {
    const map = new Map<number, { orders: number; spend: number; last: string | null }>();

    for (const order of ordersQuery.data.items) {
      const current = map.get(order.customer_id) ?? { orders: 0, spend: 0, last: null };
      current.orders += 1;
      current.spend += Number(order.total);
      current.last = current.last ? (new Date(current.last) > new Date(order.date_created) ? current.last : order.date_created) : order.date_created;
      map.set(order.customer_id, current);
    }

    return map;
  }, [ordersQuery.data.items]);

  return (
    <section className="glass soft-card rounded-3xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm" />
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Orders</th>
              <th className="px-3 py-2">Spend</th>
              <th className="px-3 py-2">Avg Spend</th>
              <th className="px-3 py-2">Last Purchase</th>
              <th className="px-3 py-2">Country</th>
            </tr>
          </thead>
          <tbody>
            {customersQuery.data.items.map((customer) => {
              const stat = metrics.get(customer.id) ?? { orders: 0, spend: 0, last: null };
              const average = stat.orders ? stat.spend / stat.orders : 0;

              return (
                <tr key={customer.id} className="border-t border-slate-100/60 text-slate-700">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <img src={customer.avatar_url || "https://placehold.co/64x64"} alt={customer.email} className="h-9 w-9 rounded-full" />
                      <span className="font-medium">{`${customer.first_name} ${customer.last_name}`.trim() || customer.username}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">{customer.email}</td>
                  <td className="px-3 py-3">{customer.billing.phone || "-"}</td>
                  <td className="px-3 py-3">{stat.orders}</td>
                  <td className="px-3 py-3">{formatCurrency(stat.spend)}</td>
                  <td className="px-3 py-3">{formatCurrency(average)}</td>
                  <td className="px-3 py-3">{stat.last ? new Date(stat.last).toLocaleDateString() : "-"}</td>
                  <td className="px-3 py-3">{customer.billing.country || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Total: {customersQuery.data.total}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg bg-white/80 px-3 py-1.5 disabled:opacity-40">Prev</button>
          <button disabled={page >= customersQuery.data.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg bg-white/80 px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>
    </section>
  );
}
