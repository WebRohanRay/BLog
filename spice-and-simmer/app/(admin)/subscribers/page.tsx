"use client";

import { useState, useEffect } from "react";
import { getAllSubscribers } from "@/lib/firebase/queries";
import type { Subscriber } from "@/types";
import { formatDate } from "@/lib/utils/helpers";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSubscribers()
      .then(setSubscribers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const confirmed = subscribers.filter((s) => s.confirmed);

  const exportCsv = () => {
    const rows = [
      ["Email", "Confirmed", "Subscribed Date"],
      ...confirmed.map((s) => [s.email, "yes", s.createdAt]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-400 text-sm mt-1">
            {confirmed.length} confirmed · {subscribers.length - confirmed.length} unconfirmed
          </p>
        </div>
        <button onClick={exportCsv} className="btn-secondary gap-2">
          📥 Export CSV
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="table-base">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th className="hidden sm:table-cell">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400">Loading…</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-400">No subscribers yet.</td></tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="font-mono text-sm">{s.email}</td>
                  <td>
                    <span className={s.confirmed ? "badge-green" : "badge-yellow"}>
                      {s.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell text-sm text-gray-400">{formatDate(s.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
