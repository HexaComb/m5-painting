"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Calendar,
  Download,
  Loader2,
  MousePointerClick,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Time range presets ────────────────────────────────────────────────
type Preset = "today" | "7d" | "30d" | "90d" | "custom";

function getPresetRange(preset: Preset): { start: number; end: number } {
  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  switch (preset) {
    case "today":
      return { start: todayStart.getTime(), end: now };
    case "7d":
      return { start: now - 7 * 86_400_000, end: now };
    case "30d":
      return { start: now - 30 * 86_400_000, end: now };
    case "90d":
      return { start: now - 90 * 86_400_000, end: now };
    default:
      return { start: now - 7 * 86_400_000, end: now };
  }
}

function formatDate(ts: number, bucketSize: "hour" | "day"): string {
  const d = new Date(ts);
  if (bucketSize === "hour") {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDateISO(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Colors ────────────────────────────────────────────────────────────
const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const CATEGORY_COLORS: Record<string, string> = {
  conversion: "#10b981",
  engagement: "#3b82f6",
  navigation: "#8b5cf6",
  lead_generation: "#f59e0b",
  outbound: "#ec4899",
};

// ─── CSV export ────────────────────────────────────────────────────────
function exportCSV(
  logs: Array<{
    eventName: string;
    category: string;
    label: string;
    targetElement: string;
    timestamp: number;
    url: string;
    sessionId: string;
  }>,
  filename: string,
) {
  const header = "Event Name,Category,Label,Target Element,Timestamp,URL,Session ID";
  const rows = logs.map(
    (l) =>
      `"${l.eventName}","${l.category}","${l.label}","${l.targetElement}","${new Date(l.timestamp).toISOString()}","${l.url}","${l.sessionId}"`,
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function AnalyticsPage() {
  // ─── State ───────────────────────────────────────────────────────────
  const [preset, setPreset] = useState<Preset>("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState<string>("all");

  // ─── Compute time range ──────────────────────────────────────────────
  const { start, end } = useMemo(() => {
    if (preset === "custom" && customStart && customEnd) {
      const s = new Date(customStart);
      s.setHours(0, 0, 0, 0);
      const e = new Date(customEnd);
      e.setHours(23, 59, 59, 999);
      return { start: s.getTime(), end: e.getTime() };
    }
    return getPresetRange(preset);
  }, [preset, customStart, customEnd]);

  const bucketSize = useMemo<"hour" | "day">(() => {
    const rangeMs = end - start;
    // Use hourly buckets for ranges <= 2 days
    return rangeMs <= 2 * 86_400_000 ? "hour" : "day";
  }, [start, end]);

  // ─── Queries ─────────────────────────────────────────────────────────
  const summary = useQuery(api.eventLogs.getSummary, {
    startTime: start,
    endTime: end,
  });

  const timeSeries = useQuery(api.eventLogs.getTimeSeries, {
    startTime: start,
    endTime: end,
    bucketSize,
    eventName: eventFilter !== "all" ? eventFilter : undefined,
  });

  const rawLogs = useQuery(api.eventLogs.getByTimeRange, {
    startTime: start,
    endTime: end,
  });

  // ─── Derived data ────────────────────────────────────────────────────
  const chartData = useMemo(
    () =>
      timeSeries?.map((d) => ({
        ...d,
        label: formatDate(d.bucket, bucketSize),
      })) ?? [],
    [timeSeries, bucketSize],
  );

  const pieData = useMemo(
    () =>
      summary?.categoryBreakdown.map((c) => ({
        name: c.category.replace(/_/g, " "),
        value: c.count,
        fill: CATEGORY_COLORS[c.category] ?? "#94a3b8",
      })) ?? [],
    [summary],
  );

  const eventOptions = useMemo(
    () => summary?.eventBreakdown.map((e) => e.eventName) ?? [],
    [summary],
  );

  const rangeLabel = useMemo(() => {
    if (preset === "today") return "Today";
    if (preset === "7d") return "Last 7 days";
    if (preset === "30d") return "Last 30 days";
    if (preset === "90d") return "Last 90 days";
    if (customStart && customEnd) {
      return `${new Date(customStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${new Date(customEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return "Custom range";
  }, [preset, customStart, customEnd]);

  // ─── Export handler ──────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    if (!rawLogs) return;
    const dateStr = formatDateISO(Date.now());
    exportCSV(rawLogs, `m5-events-${dateStr}.csv`);
  }, [rawLogs]);

  // ─── Custom date dialog save ────────────────────────────────────────
  function handleCustomDateSave() {
    if (customStart && customEnd) {
      setPreset("custom");
      setCustomDialogOpen(false);
    }
  }

  const isLoading = summary === undefined;

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground">{rangeLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Preset buttons */}
          {(["today", "7d", "30d", "90d"] as const).map((p) => (
            <Button
              key={p}
              variant={preset === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPreset(p)}
            >
              {p === "today" ? "Today" : p === "7d" ? "7D" : p === "30d" ? "30D" : "90D"}
            </Button>
          ))}
          <Button
            variant={preset === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomDialogOpen(true)}
          >
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            Custom
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Export */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!rawLogs?.length}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <MousePointerClick className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {summary?.totalHits.toLocaleString() ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {summary?.uniqueSessions.toLocaleString() ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Unique Sessions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {summary?.eventBreakdown.length ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active Event Types
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {summary?.totalHits && summary?.uniqueSessions
                      ? (
                          summary.totalHits / summary.uniqueSessions
                        ).toFixed(1)
                      : "0"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Events / Session
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Area chart — events over time */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="h-4 w-4" />
                      Events Over Time
                    </CardTitle>
                    <CardDescription>
                      {bucketSize === "hour" ? "Hourly" : "Daily"} event volume
                    </CardDescription>
                  </div>

                  {/* Event filter */}
                  <Select
                    value={eventFilter}
                    onValueChange={(val: string | null) => {
                      if (val) setEventFilter(val);
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All events</SelectItem>
                      {eventOptions.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                    No events recorded in this period
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorCount"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          fontSize: "13px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        name="Events"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Pie chart — by category */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">By Category</CardTitle>
                <CardDescription>Event distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {pieData.length === 0 ? (
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                    No data
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={entry.fill ?? CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          fontSize: "13px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top events bar chart + table */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bar chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Events</CardTitle>
                <CardDescription>
                  Most triggered events in this period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(summary?.eventBreakdown.length ?? 0) === 0 ? (
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                    No events recorded
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={summary!.eventBreakdown.slice(0, 8)}
                      layout="vertical"
                      margin={{ left: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={160}
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          fontSize: "13px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        name="Hits"
                        radius={[0, 4, 4, 0]}
                      >
                        {summary!.eventBreakdown.slice(0, 8).map((entry, i) => (
                          <Cell
                            key={entry.eventName}
                            fill={CATEGORY_COLORS[entry.category] ?? CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Event breakdown table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Event Breakdown</CardTitle>
                <CardDescription>All events with hit counts</CardDescription>
              </CardHeader>
              <CardContent>
                {(summary?.eventBreakdown.length ?? 0) === 0 ? (
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                    No events recorded
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b text-left text-xs text-muted-foreground">
                          <th className="pb-2 font-medium">Event</th>
                          <th className="pb-2 font-medium">Category</th>
                          <th className="pb-2 text-right font-medium">Hits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary!.eventBreakdown.map((event) => (
                          <tr
                            key={event.eventName}
                            className="border-b last:border-0"
                          >
                            <td className="py-2.5">
                              <div className="font-medium">{event.label}</div>
                              <code className="text-[11px] text-muted-foreground">
                                {event.eventName}
                              </code>
                            </td>
                            <td className="py-2.5">
                              <span
                                className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                                style={{
                                  backgroundColor: `${CATEGORY_COLORS[event.category] ?? "#94a3b8"}15`,
                                  color:
                                    CATEGORY_COLORS[event.category] ??
                                    "#64748b",
                                }}
                              >
                                {event.category.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="py-2.5 text-right font-semibold tabular-nums">
                              {event.count.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent activity log */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription>
                    Last 50 events in this period
                  </CardDescription>
                </div>
                {rawLogs && rawLogs.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {rawLogs.length.toLocaleString()} total hits
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!rawLogs || rawLogs.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  No events recorded in this period
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background">
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 font-medium">Time</th>
                        <th className="pb-2 font-medium">Event</th>
                        <th className="pb-2 font-medium">Category</th>
                        <th className="pb-2 font-medium">Page</th>
                        <th className="pb-2 font-medium">Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rawLogs
                        .slice()
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, 50)
                        .map((log) => (
                          <tr
                            key={log._id}
                            className="border-b last:border-0"
                          >
                            <td className="py-2 text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </td>
                            <td className="py-2">
                              <span className="font-medium">{log.label}</span>
                            </td>
                            <td className="py-2">
                              <span
                                className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                                style={{
                                  backgroundColor: `${CATEGORY_COLORS[log.category] ?? "#94a3b8"}15`,
                                  color:
                                    CATEGORY_COLORS[log.category] ?? "#64748b",
                                }}
                              >
                                {log.category.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td className="py-2 text-xs text-muted-foreground max-w-32 truncate">
                              {log.url
                                ? new URL(log.url).pathname
                                : "—"}
                            </td>
                            <td className="py-2">
                              <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                                {log.sessionId.slice(0, 8)}
                              </code>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Custom Date Range Dialog */}
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Custom Date Range</DialogTitle>
            <DialogDescription>
              Select a start and end date for your analytics view.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                max={formatDateISO(Date.now())}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                max={formatDateISO(Date.now())}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCustomDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCustomDateSave}
              disabled={!customStart || !customEnd}
            >
              Apply Range
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
