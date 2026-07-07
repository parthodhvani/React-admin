import { useState } from "react";
import { useProductsQuery } from "../../hooks/useWooQueries";
import { formatCurrency } from "../../lib/utils";
import { WooStatePanel } from "../ui/WooStatePanel";

export function ProductsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [stock, setStock] = useState("");

  const query = useProductsQuery({
    page,
    per_page: 15,
    search: search || undefined,
    stock_status: (stock || undefined) as "instock" | "outofstock" | "onbackorder" | undefined,
    orderby: "date",
    order: "desc",
  });

  if (query.isLoading || query.error || !query.data) {
    return <WooStatePanel loading={query.isLoading} error={query.error instanceof Error ? query.error.message : undefined} title="products" />;
  }

  return (
    <section className="glass soft-card rounded-3xl p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm" />
        <select value={stock} onChange={(event) => setStock(event.target.value)} className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm">
          <option value="">All stock</option>
          <option value="instock">In stock</option>
          <option value="outofstock">Out of stock</option>
          <option value="onbackorder">Backorder</option>
        </select>
      </div>

      <div className="scrollbar-thin overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Sales</th>
              <th className="px-3 py-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {query.data.items.map((product) => (
              <tr key={product.id} className="border-t border-slate-100/60 text-slate-700">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <img src={product.images[0]?.src || "https://placehold.co/64x64"} alt={product.name} className="h-9 w-9 rounded-lg object-cover" />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3">{product.sku || "-"}</td>
                <td className="px-3 py-3">{product.categories[0]?.name || "-"}</td>
                <td className="px-3 py-3">{product.stock_quantity ?? 0} ({product.stock_status})</td>
                <td className="px-3 py-3">{formatCurrency(Number(product.price || product.regular_price || 0))}</td>
                <td className="px-3 py-3">{product.total_sales}</td>
                <td className="px-3 py-3">{product.average_rating} ({product.rating_count})</td>
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
