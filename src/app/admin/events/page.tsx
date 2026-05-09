"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MousePointerClick,
  Send,
  Zap,
} from "lucide-react";
import Link from "next/link";

// ─── Trackable elements on the public site ─────────────────────────────
const TRACKABLE_ELEMENTS = [
  { id: "hero-estimate", label: "Hero → Get a Free Estimate", section: "Hero" },
  { id: "hero-phone", label: "Hero → Phone Button", section: "Hero" },
  { id: "header-estimate", label: "Header → Free Estimate", section: "Header" },
  { id: "header-phone", label: "Header → Phone Button", section: "Header" },
  { id: "projects-estimate", label: "Projects → Get Your Free Estimate", section: "Projects" },
  { id: "contact-submit", label: "Contact → Submit Form", section: "Contact" },
  { id: "nav-services", label: "Nav → Services", section: "Navigation" },
  { id: "nav-work", label: "Nav → Our Work", section: "Navigation" },
  { id: "nav-about", label: "Nav → About", section: "Navigation" },
  { id: "nav-reviews", label: "Nav → Reviews", section: "Navigation" },
] as const;

const CATEGORIES = [
  "engagement",
  "conversion",
  "navigation",
  "lead_generation",
  "outbound",
] as const;

type TriggerType = "click" | "form_submit";

interface EventFormData {
  name: string;
  category: string;
  label: string;
  targetElement: string;
  trigger: TriggerType;
  enabled: boolean;
}

const emptyForm: EventFormData = {
  name: "",
  category: "engagement",
  label: "",
  targetElement: "",
  trigger: "click",
  enabled: true,
};

export default function EventsPage() {
  const events = useQuery(api.trackingEvents.getAll);
  const addEvent = useMutation(api.trackingEvents.add);
  const updateEvent = useMutation(api.trackingEvents.update);
  const removeEvent = useMutation(api.trackingEvents.remove);
  const toggleEnabled = useMutation(api.trackingEvents.toggleEnabled);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"trackingEvents"> | null>(null);
  const [form, setForm] = useState<EventFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"trackingEvents"> | null>(null);

  function openCreateDialog() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEditDialog(event: NonNullable<typeof events>[number]) {
    setEditingId(event._id);
    setForm({
      name: event.name,
      category: event.category,
      label: event.label,
      targetElement: event.targetElement,
      trigger: event.trigger,
      enabled: event.enabled,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editingId) {
        await updateEvent({ id: editingId, ...form });
      } else {
        await addEvent(form);
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: Id<"trackingEvents">) {
    await removeEvent({ id });
    setDeleteConfirm(null);
  }

  // Auto-generate event name from target element and trigger
  function autoName(targetElement: string, trigger: TriggerType): string {
    const el = TRACKABLE_ELEMENTS.find((e) => e.id === targetElement);
    if (!el) return "";
    const base = el.id.replace(/-/g, "_");
    return trigger === "form_submit" ? `${base}_submit` : `${base}_click`;
  }

  const activeCount = events?.filter((e: { enabled: boolean }) => e.enabled).length ?? 0;
  const totalCount = events?.length ?? 0;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Tracking</h1>
          <p className="mt-1 text-muted-foreground">
            Register custom analytics events for buttons and interactions on your
            site.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/analytics">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-xs text-muted-foreground">Total Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <MousePointerClick className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{TRACKABLE_ELEMENTS.length}</p>
              <p className="text-xs text-muted-foreground">Trackable Elements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info card */}
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 p-4">
          <Activity className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">How it works</p>
            <p className="mt-1">
              Events you create here are automatically registered on the public
              site. When a visitor clicks a tracked button, the event fires to
              your analytics provider (GA4, Meta Pixel, etc.). No code changes
              needed — just create an event, pick a button, and it&apos;s live.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Events list */}
      {events === undefined ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-muted/60"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Activity className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No events yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first tracking event to start capturing analytics from
              button clicks on your site.
            </p>
            <Button onClick={openCreateDialog} className="mt-6">
              <Plus className="mr-2 h-4 w-4" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((event: {
            _id: Id<"trackingEvents">;
            _creationTime: number;
            name: string;
            category: string;
            label: string;
            targetElement: string;
            trigger: "click" | "form_submit";
            enabled: boolean;
          }) => {
            const target = TRACKABLE_ELEMENTS.find(
              (e) => e.id === event.targetElement,
            );
            return (
              <Card
                key={event._id}
                className={!event.enabled ? "opacity-60" : ""}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Trigger icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      event.enabled
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {event.trigger === "form_submit" ? (
                      <Send className="h-5 w-5" />
                    ) : (
                      <MousePointerClick className="h-5 w-5" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{event.label}</p>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                          event.enabled
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.enabled ? "Active" : "Paused"}
                      </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
                          {event.name}
                        </code>
                      </span>
                      <span>→ {target?.label ?? event.targetElement}</span>
                      <span className="capitalize">{event.category}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={event.enabled ? "Pause" : "Enable"}
                      onClick={() => toggleEnabled({ id: event._id })}
                    >
                      {event.enabled ? (
                        <ToggleRight className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Edit"
                      onClick={() => openEditDialog(event)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="Delete"
                      onClick={() => setDeleteConfirm(event._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Event" : "Create Tracking Event"}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update this event's configuration."
                : "Set up a new analytics event for a button on your site."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Target Element */}
            <div className="space-y-2">
              <Label>Target Button</Label>
              <Select
                value={form.targetElement}
                onValueChange={(val: string | null) => {
                  if (!val) return;
                  const newForm = { ...form, targetElement: val };
                  // Auto-fill name and label if creating new
                  if (!editingId) {
                    const el = TRACKABLE_ELEMENTS.find((e) => e.id === val);
                    newForm.name = autoName(val, form.trigger);
                    newForm.label = el?.label ?? "";
                    // Auto-set category based on section
                    if (el?.section === "Navigation") {
                      newForm.category = "navigation";
                    } else if (
                      val.includes("phone") ||
                      val.includes("estimate") ||
                      val.includes("contact")
                    ) {
                      newForm.category = "conversion";
                    }
                  }
                  setForm(newForm);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a button to track" />
                </SelectTrigger>
                <SelectContent>
                  {TRACKABLE_ELEMENTS.map((el) => (
                    <SelectItem key={el.id} value={el.id}>
                      {el.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trigger Type */}
            <div className="space-y-2">
              <Label>Trigger</Label>
              <Select
                value={form.trigger}
                onValueChange={(val: string | null) => {
                  if (!val) return;
                  const trigger = val as TriggerType;
                  const newForm = { ...form, trigger };
                  if (!editingId && form.targetElement) {
                    newForm.name = autoName(form.targetElement, trigger);
                  }
                  setForm(newForm);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="click">Click</SelectItem>
                  <SelectItem value="form_submit">Form Submit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Event Name */}
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. hero_estimate_click"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This is the event name sent to your analytics provider (e.g.
                GA4).
              </p>
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label>Display Label</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="e.g. Hero → Get a Free Estimate"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(val: string | null) => {
                  if (!val) return;
                  setForm({ ...form, category: val });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <span className="capitalize">
                        {cat.replace(/_/g, " ")}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Enabled */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.enabled}
                onClick={() => setForm({ ...form, enabled: !form.enabled })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  form.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    form.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <Label className="cursor-pointer">
                {form.enabled ? "Enabled — event is live" : "Disabled — event is paused"}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name || !form.targetElement || !form.label}
            >
              {saving ? "Saving…" : editingId ? "Save Changes" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              This will permanently remove this tracking event. Analytics data
              already collected is not affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
