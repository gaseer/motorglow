"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Booking, BookingStatus } from "@/lib/types";
import { Search, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const badgeVariant = (s: BookingStatus): "amber" | "blue" | "lime" | "green" | "red" => {
  const m: Record<BookingStatus, "amber" | "blue" | "lime" | "green" | "red"> = {
    pending: "amber",
    confirmed: "blue",
    in_progress: "lime",
    completed: "green",
    cancelled: "red",
  };
  return m[s] || "amber";
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Modals
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        status: statusFilter,
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();
      setBookings(data.data || []);
      setTotal(data.count || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, dateFrom, dateTo, search]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/bookings/${deleteTarget}`, { method: "DELETE" });
      setDeleteTarget(null);
      fetchBookings();
    } finally {
      setDeleting(false);
    }
  };

  const pageCount = Math.ceil(total / 20);

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#0D0D0D] mb-6">Bookings</h1>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-4 flex flex-wrap gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
                placeholder="Search phone, plate, location…"
                className="w-full pl-9 pr-4 py-2 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135]"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Date range */}
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135]"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-[8px] border border-[#E5E5E5] text-sm focus:outline-none focus:border-[#C8F135]"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#C8F135] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-center text-[#6B6B6B] py-12 text-sm">No bookings match your filters.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="border-b border-[#E5E5E5]">
                    <tr>
                      {["ID", "Customer", "Package", "Vehicle", "Location", "Date", "Time", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F5F5F5]">
                        <td className="px-4 py-3 font-mono text-xs text-[#6B6B6B] whitespace-nowrap">
                          {b.id.slice(0, 8)}…
                        </td>
                        <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">
                          {b.customer_phone || "—"}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#0D0D0D] whitespace-nowrap">
                          {b.package_name}
                        </td>
                        <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">{b.vehicle}</td>
                        <td className="px-4 py-3 text-[#6B6B6B] max-w-[140px] truncate">{b.location}</td>
                        <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">
                          {new Date(b.date + "T00:00:00").toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-[#6B6B6B] whitespace-nowrap">{b.time_slot}</td>
                        <td className="px-4 py-3">
                          <select
                            value={b.status}
                            disabled={updatingId === b.id}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className="text-xs border border-[#E5E5E5] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#C8F135] cursor-pointer"
                          >
                            {STATUS_OPTIONS.filter((s) => s.value !== "all").map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setViewBooking(b)}
                              className="p-1.5 rounded-lg hover:bg-[#F5F5F5] text-[#6B6B6B] hover:text-[#0D0D0D] cursor-pointer transition-colors"
                              title="View"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(b.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B6B6B] hover:text-red-600 cursor-pointer transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5]">
                <span className="text-xs text-[#6B6B6B]">
                  Page {page} of {pageCount} · {total} bookings
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-1.5 rounded-lg border border-[#E5E5E5] hover:bg-[#F5F5F5] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    disabled={page === pageCount}
                    onClick={() => setPage(page + 1)}
                    className="p-1.5 rounded-lg border border-[#E5E5E5] hover:bg-[#F5F5F5] disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* View booking modal */}
      <Modal
        open={!!viewBooking}
        onClose={() => setViewBooking(null)}
        title="Booking Details"
      >
        {viewBooking && (
          <dl className="flex flex-col gap-3">
            {([
              ["Booking ID", viewBooking.id],
              ["Package", viewBooking.package_name],
              ["Customer", viewBooking.customer_phone || "—"],
              ["Vehicle", viewBooking.vehicle],
              ["Location", viewBooking.location],
              ["Date", new Date(viewBooking.date + "T00:00:00").toLocaleDateString("en-IN")],
              ["Time", viewBooking.time_slot],
              ["Notes", viewBooking.notes || "—"],
              ["Status", viewBooking.status],
              ["Created", new Date(viewBooking.created_at).toLocaleString("en-IN")],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex gap-4">
                <dt className="text-sm text-[#6B6B6B] w-28 shrink-0">{label}</dt>
                <dd className="text-sm font-medium text-[#0D0D0D]">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Booking"
        className="max-w-sm"
      >
        <p className="text-sm text-[#6B6B6B] mb-5">
          Are you sure you want to delete this booking? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={deleting}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
