"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type ServiceForm = {
  iconName: string;
  title: string;
  description: string;
  items: string[];
};

const emptyForm: ServiceForm = {
  iconName: "Paintbrush",
  title: "",
  description: "",
  items: [""],
};

export default function ServicesPage() {
  const services = useQuery(api.content.getServices);
  const updateService = useMutation(api.content.updateService);
  const addService = useMutation(api.content.addService);
  const deleteService = useMutation(api.content.deleteService);
  const [editingId, setEditingId] = useState<Id<"services"> | "new" | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"services"> | null>(null);

  const openEdit = (
    service: (typeof services extends (infer T)[] | undefined ? T : never) | null,
  ) => {
    if (service) {
      setEditingId(service._id);
      setForm({
        iconName: service.iconName,
        title: service.title,
        description: service.description,
        items: [...service.items],
      });
    } else {
      setEditingId("new");
      setForm({ ...emptyForm, items: [""] });
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const cleanItems = form.items.filter((i) => i.trim());
      if (editingId === "new") {
        await addService({ ...form, items: cleanItems });
        toast.success("Service added!");
      } else if (editingId) {
        await updateService({ id: editingId, ...form, items: cleanItems });
        toast.success("Service updated!");
      }
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"services">) => {
    try {
      await deleteService({ id });
      toast.success("Service deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const addItem = () => setForm((f) => ({ ...f, items: [...f.items, ""] }));
  const removeItem = (idx: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  const updateItem = (idx: number, val: string) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === idx ? val : item)),
    }));

  if (services === undefined) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="text-sm text-muted-foreground">
              {services.length} services listed on your site
            </p>
          </div>
        </div>
        <Button onClick={() => openEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service._id}>
            <CardContent className="flex items-center gap-4 p-4">
              <GripVertical className="h-5 w-5 shrink-0 text-muted-foreground/40" />
              <div className="flex-1">
                <p className="font-semibold">{service.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {service.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {service.items.length} items · Icon: {service.iconName}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(service)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteConfirm(service._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId === "new" ? "Add Service" : "Edit Service"}</DialogTitle>
            <DialogDescription>
              {editingId === "new" ? "Create a new service listing" : "Update service details"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Interior Painting"
                />
              </div>
              <div className="space-y-2">
                <Label>Icon Name</Label>
                <Input
                  value={form.iconName}
                  onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}
                  placeholder="Home"
                />
                <p className="text-xs text-muted-foreground">
                  Lucide icon name (Home, Paintbrush, Building2, etc.)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Describe this service..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Service Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="mr-1 h-3 w-3" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateItem(idx, e.target.value)}
                      placeholder="e.g. Single Room to Entire Home"
                    />
                    {form.items.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
