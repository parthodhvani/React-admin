import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  useReactTable,
} from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useMemo, useState } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";
import { users } from "../../data/mockData";
import { formatCurrency } from "../../lib/utils";
import { useDashboardStore } from "../../store/useDashboardStore";
import type { User } from "../../types";

export function DataTableSection() {
  const globalSearch = useDashboardStore((state) => state.search);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState("");

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: "",
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={Boolean(selectedRows[row.original.id])}
            onChange={(event) =>
              setSelectedRows((state) => ({ ...state, [row.original.id]: event.target.checked }))
            }
            aria-label={`Select ${row.original.name}`}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img src={row.original.avatar} className="h-8 w-8 rounded-full" alt={row.original.name} />
            <div>
              <p className="text-sm font-medium text-slate-800">{row.original.name}</p>
              <p className="text-xs text-slate-500">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "country", header: "Country" },
      { accessorKey: "orders", header: "Orders" },
      {
        accessorKey: "revenue",
        header: "Revenue",
        cell: ({ row }) => formatCurrency(row.original.revenue),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              row.original.status === "Active"
                ? "bg-emerald-100 text-emerald-700"
                : row.original.status === "Idle"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-200 text-slate-700"
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
    ],
    [selectedRows],
  );

  const filteredUsers = useMemo(() => {
    if (statusFilter === "All") return users;
    return users.filter((user) => user.status === statusFilter);
  }, [statusFilter]);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: { globalFilter: globalSearch },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const term = String(filterValue).toLowerCase();
      return `${row.original.name} ${row.original.email} ${row.original.country}`
        .toLowerCase()
        .includes(term);
    },
  });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <section className="glass soft-card rounded-3xl p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Enterprise User Directory</h2>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Active</option>
            <option>Idle</option>
            <option>Offline</option>
          </select>
          <button
            onClick={() => setBannerMessage("Import simulated successfully.")}
            className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-700"
          >
            <FiUpload className="mr-2 inline" /> Import
          </button>
          <button
            onClick={() => setBannerMessage(`Exported ${table.getRowModel().rows.length} rows.`)}
            className="rounded-xl bg-white/80 px-3 py-2 text-sm text-slate-700"
          >
            <FiDownload className="mr-2 inline" /> Export
          </button>
        </div>
      </div>

      {bannerMessage && (
        <div className="mb-3 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
          {bannerMessage}
          <button onClick={() => setBannerMessage("")}>Dismiss</button>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="mb-3 rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-700">
          {selectedCount} row(s) selected.
        </div>
      )}

      <div className="scrollbar-thin overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
          <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer px-3 py-2 text-xs uppercase tracking-wider text-slate-500"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
                <th className="px-3 py-2 text-xs uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <motion.tr
                  layout
                  className="rounded-2xl bg-white/75 transition hover:bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <button
                      onClick={() =>
                        setExpandedRow((state) => (state === row.original.id ? null : row.original.id))
                      }
                      className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600"
                    >
                      {expandedRow === row.original.id ? "Hide" : "Details"}
                    </button>
                  </td>
                </motion.tr>

                <AnimatePresence>
                  {expandedRow === row.original.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <td colSpan={8} className="px-4 pb-3">
                        <div className="rounded-2xl bg-white/70 p-3 text-xs text-slate-600">
                          <p>
                            <span className="font-semibold text-slate-800">Profile summary:</span> {row.original.name}
                            {" "}has {row.original.orders} orders and generated {formatCurrency(row.original.revenue)}.
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Showing {table.getRowModel().rows.length} of {filteredUsers.length} rows
        </span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-xl bg-white/80 px-3 py-1.5 disabled:opacity-40"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="rounded-xl bg-white/80 px-3 py-1.5 disabled:opacity-40"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
