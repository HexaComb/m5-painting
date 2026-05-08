/* eslint-disable @next/next/no-img-element */
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ImageIcon, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type ProjectForm = { imageUrl: string; altText: string; label: string; span: "large" | "small" };
const emptyForm: ProjectForm = { imageUrl: "", altText: "", label: "", span: "small" };

export default function ProjectsPage() {
  const projects = useQuery(api.content.getProjects);
  const updateProject = useMutation(api.content.updateProject);
  const addProject = useMutation(api.content.addProject);
  const deleteProject = useMutation(api.content.deleteProject);
  const [editingId, setEditingId] = useState<Id<"projects"> | "new" | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"projects"> | null>(null);

  const openEdit = (
    project: (typeof projects extends (infer T)[] | undefined ? T : never) | null,
  ) => {
    if (project) {
      setEditingId(project._id);
      setForm({ imageUrl: project.imageUrl, altText: project.altText, label: project.label, span: project.span });
    } else {
      setEditingId("new");
      setForm({ ...emptyForm });
    }
  };

  const handleSave = async () => {
    if (!form.label.trim() || !form.imageUrl.trim()) {
      toast.error("Image URL and label are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        await addProject(form);
        toast.success("Project added!");
      } else if (editingId) {
        await updateProject({ id: editingId, ...form });
        toast.success("Project updated!");
      }
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"projects">) => {
    try {
      await deleteProject({ id });
      toast.success("Project deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (projects === undefined) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Projects Gallery</h1>
            <p className="text-sm text-muted-foreground">{projects.length} projects in gallery</p>
          </div>
        </div>
        <Button onClick={() => openEdit(null)}><Plus className="mr-2 h-4 w-4" />Add Project</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project._id} className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-muted">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.altText} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="flex h-full items-center justify-center"><ImageIcon className="h-8 w-8 text-muted-foreground/30" /></div>
              )}
              <div className="absolute bottom-2 left-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold shadow-sm">{project.label}</span>
              </div>
              <span className="absolute right-2 top-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">{project.span}</span>
            </div>
            <CardContent className="flex items-center justify-between p-3">
              <p className="text-sm text-muted-foreground line-clamp-1">{project.altText}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(project)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(project._id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId === "new" ? "Add Project" : "Edit Project"}</DialogTitle>
            <DialogDescription>{editingId === "new" ? "Add a new project to the gallery" : "Update project details"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Image URL</Label><Input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} placeholder="/images/project-example.webp" /></div>
            <div className="space-y-2"><Label>Alt Text</Label><Input value={form.altText} onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))} placeholder="Describe the image for accessibility" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Label</Label><Input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Exterior" /></div>
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={form.span} onValueChange={(val) => { if (val === "large" || val === "small") setForm((f) => ({ ...f, span: val })); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="large">Large (spans 2 cols)</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Project</DialogTitle><DialogDescription>Are you sure? This will remove the project from the gallery.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
