"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, Download, Mail, Users } from "lucide-react";

interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  createdAt: Date;
}

export function WaitlistContent({ entries }: { entries: WaitlistEntry[] }) {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  const sources = Array.from(new Set(entries.map((e) => e.source))).sort();

  const filtered = entries.filter((entry) => {
    if (search && !entry.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (sourceFilter !== "all" && entry.source !== sourceFilter) {
      return false;
    }
    return true;
  });

  function exportCSV() {
    const header = "Email,Source,Date\n";
    const rows = filtered
      .map(
        (e) =>
          `${e.email},${e.source},${format(new Date(e.createdAt), "yyyy-MM-dd HH:mm")}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beautylink-waitlist-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark">Mailing List</h1>
          <p className="text-muted mt-1">
            {entries.length} total signups
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-dark/90 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-accent" />}
          label="Total Signups"
          value={entries.length}
        />
        <StatCard
          icon={<Mail className="h-5 w-5 text-accent" />}
          label="This Week"
          value={
            entries.filter(
              (e) =>
                new Date(e.createdAt).getTime() >
                Date.now() - 7 * 24 * 60 * 60 * 1000
            ).length
          }
        />
        <StatCard
          icon={<Mail className="h-5 w-5 text-accent" />}
          label="This Month"
          value={
            entries.filter(
              (e) =>
                new Date(e.createdAt).getTime() >
                Date.now() - 30 * 24 * 60 * 60 * 1000
            ).length
          }
        />
        <StatCard
          icon={<Mail className="h-5 w-5 text-accent" />}
          label="Sources"
          value={sources.length}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="all">All Sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="px-4 py-3 text-left font-semibold text-dark">#</th>
              <th className="px-4 py-3 text-left font-semibold text-dark">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-dark">Source</th>
              <th className="px-4 py-3 text-left font-semibold text-dark">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                  No entries found.
                </td>
              </tr>
            ) : (
              filtered.map((entry, i) => (
                <tr
                  key={entry.id}
                  className="border-b border-border/50 hover:bg-background/30 transition-colors"
                >
                  <td className="px-4 py-3 text-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${entry.email}`}
                      className="text-accent hover:underline"
                    >
                      {entry.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {format(new Date(entry.createdAt), "MMM d, yyyy h:mm a")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted">
        Showing {filtered.length} of {entries.length} entries
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-2xl font-bold text-dark">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
