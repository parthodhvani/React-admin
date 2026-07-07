import { useMemo, useState } from "react";
import { useOrdersQuery } from "../../hooks/useWooQueries";
import { formatCurrency } from "../../lib/utils";
import { WooStatePanel } from "../ui/WooStatePanel";

export function OrdersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const query = useOrdersQuery({
    page,
    per_page: 15,
    search: search || undefined,
    status: status || undefined,
    orderby: "date",
    order: "desc",
  });

  const rows = query.data?.items ?? [];

  const exportCsv = () => {
    const headers = ["id", "date", "status", "customer", "payment", "total"];
    const lines = rows.map((order) =>
      [
        order.id,
        order.date_created,
        order.status,
        `${order.billing.first_name} ${order.billing.last_name}`.trim(),
        order.payment_method_title,
        order.total,
      ].join(","),
    );

    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusOptions = useMemo(() => {
    const set = new Set(rows.map((order) => order.status));
    return [...set];
  }, [rows]);

  if (query.isLoading || query.error || !query.data) {
    return <WooStatePanel loading={query.isLoading} error={query.error instanceof Error ? query.error.message : undefined} title="orders" />;
  }

  return (
    <section className="glass soft-card rounded-3xl p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search orders"
          className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
        />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm">
          <option value="">All status</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <button onClick={exportCsv} className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-700">Export CSV</button>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id} className="border-t border-slate-100/60 text-slate-700">
                <td className="px-3 py-3 font-medium">#{order.id}</td>
                <td className="px-3 py-3">{`${order.billing.first_name} ${order.billing.last_name}`.trim() || order.billing.email}</td>
                <td className="px-3 py-3">{new Date(order.date_created).toLocaleString()}</td>
                <td className="px-3 py-3 capitalize">{order.status}</td>
                <td className="px-3 py-3">{order.payment_method_title}</td>
                <td className="px-3 py-3">{formatCurrency(Number(order.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Total: {query.data.total}</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg bg-white/80 px-3 py-1.5 disabled:opacity-40">Prev</button>
          <button disabled={page >= query.data.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg bg-white/80 px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>
    </section>
  );
}
