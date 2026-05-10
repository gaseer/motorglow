"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import {
  CalendarCheck,
  Clock,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Booking, BookingStatus } from "@/lib/types";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bookings?page=1")
      .then((r) => r.json())
      .then((d) => { setBookings(d.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    inProgress: bookings.filter((b) => b.status === "in_progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  const statusBadgeVariant = (s: BookingStatus) => {
    const m: Record<BookingStatus, "amber" | "blue" | "lime" | "green" | "red"> = {
      pending: "amber",
      confirmed: "blue",
      in_progress: "lime",
      completed: "green",
      cancelled: "red",
    };
    return m[s] ?? "default";
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-[#0D0D0D] mb-6">Overview</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Bookings" value={stats.total} icon={CalendarCheck} />
            <StatCard title="Pending" value={stats.pending} icon={Clock} color="amber" />
            <StatCard title="In Progress" value={stats.inProgress} icon={Zap} color="lime" />
            <StatCard title="Completed" value={stats.completed} icon={CheckCircle} color="green" />
          </div>

          {/* Recent bookings */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5]">
            <div className="px-5 py-4 border-b border-[#E5E5E5]">
              <h2 className="font-semibold text-[#0D0D0D]">Recent Bookings</h2>
            </div>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-[#C8F135] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <p className="text-center text-[#6B6B6B] py-10 text-sm">No bookings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E5E5]">
                      {["ID", "Customer", "Package", "Date", "Status"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 10).map((b) => (
                      <tr
                        key={b.id}
                        className="border-b border-[#E5E5E5] last:border-0 hover:bg-[#F5F5F5]"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-[#6B6B6B]">
                          {b.id.slice(0, 8)}…
                        </td>
                        <td className="px-4 py-3 text-[#6B6B6B]">
                          {b.customer_phone || "—"}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#0D0D0D]">
                          {b.package_name}
                        </td>
                        <td className="px-4 py-3 text-[#6B6B6B]">
                          {new Date(b.date + "T00:00:00").toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusBadgeVariant(b.status)}>
                            {b.status.replace("_", " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
