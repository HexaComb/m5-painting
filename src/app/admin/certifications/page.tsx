"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Award,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

type CertificationForm = {
  label: string;
  imagePath: string;
  showInHero: boolean;
  showInFooter: boolean;
  enabled: boolean;
};

const emptyForm: CertificationForm = {
  label: "",
  imagePath: "",
  showInHero: false,
  showInFooter: true,
  enabled: true,
};

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export default function CertificationsPage() {
  const certifications = useQuery(api.content.getCertificationsAdmin);
  const ensureDefaults = useMutation(api.content.ensureDefaultCertifications);
  const addCertification = useMutation(api.content.addCertification);
  const updateCertification = useMutation(api.content.updateCertification);
  const deleteCertification = useMutation(api.content.deleteCertification);
  const generateUploadUrl = useMutation(
    api.content.generateCertificationImageUploadUrl,
  );

  const [editingId, setEditingId] = useState<
    Id<"certifications"> | "new" | null
  >(null);
  const [form, setForm] = useState<CertificationForm>(emptyForm);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [pendingStorageId, setPendingStorageId] = useState<
    Id<"_storage"> | undefined
  >(undefined);
  const [clearImage, setClearImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<
    Id<"certifications"> | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    if (certifications === undefined || seededRef.current) return;
    if (certifications.length > 0) return;
    seededRef.current = true;
    setSeeding(true);
    ensureDefaults()
      .then((created) => {
        if (created) toast.success("Default certifications loaded");
      })
      .catch(() => {
        seededRef.current = false;
      })
      .finally(() => setSeeding(false));
  }, [certifications, ensureDefaults]);

  const openEdit = (
    cert: NonNullable<typeof certifications>[number] | null,
  ) => {
    if (cert) {
      setEditingId(cert._id);
      setForm({
        label: cert.label,
        imagePath: cert.imageUrl?.startsWith("/") ? cert.imageUrl : "",
        showInHero: cert.showInHero,
        showInFooter: cert.showInFooter,
        enabled: cert.enabled !== false,
      });
      setPreviewUrl(cert.imageUrl);
      setPendingStorageId(undefined);
      setClearImage(false);
    } else {
      setEditingId("new");
      setForm(emptyForm);
      setPreviewUrl(undefined);
      setPendingStorageId(undefined);
      setClearImage(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be under 2 MB");
      return;
    }
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = (await res.json()) as { storageId: Id<"_storage"> };
      setPendingStorageId(storageId);
      setPreviewUrl(URL.createObjectURL(file));
      setForm((f) => ({ ...f, imagePath: "" }));
      setClearImage(false);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.label.trim()) {
      toast.error("Label is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        label: form.label.trim(),
        showInHero: form.showInHero,
        showInFooter: form.showInFooter,
        enabled: form.enabled,
      };
      if (editingId === "new") {
        await addCertification({
          ...payload,
          imageStorageId: pendingStorageId,
          imagePath:
            !pendingStorageId && form.imagePath.trim()
              ? form.imagePath.trim()
              : undefined,
        });
        toast.success("Certification added");
      } else if (editingId) {
        await updateCertification({
          id: editingId,
          ...payload,
          imageStorageId: pendingStorageId,
          imagePath: form.imagePath.trim() || undefined,
          clearImage,
        });
        toast.success("Certification updated");
      }
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"certifications">) => {
    try {
      await deleteCertification({ id });
      toast.success("Certification deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (certifications === undefined || seeding) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certifications</h1>
          <p className="text-sm text-muted-foreground">
            Manage trust badges shown in the hero and footer.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => openEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add certification
        </Button>
      </div>

      <div className="space-y-3">
        {certifications.map((cert) => (
          <Card key={cert._id}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border">
                {cert.imageUrl ? (
                  <Image
                    src={cert.imageUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Award className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{cert.label}</p>
                <p className="text-xs text-muted-foreground">
                  {cert.enabled === false
                    ? "Hidden"
                    : [
                        cert.showInHero ? "Hero" : null,
                        cert.showInFooter ? "Footer" : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Not shown anywhere"}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(cert)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteConfirm(cert._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editingId !== null} onOpenChange={() => setEditingId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId === "new" ? "Add certification" : "Edit certification"}
            </DialogTitle>
            <DialogDescription>
              Choose where this badge appears on the public site.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cert-label">Label</Label>
              <Input
                id="cert-label"
                value={form.label}
                onChange={(e) =>
                  setForm((f) => ({ ...f, label: e.target.value }))
                }
                placeholder="BBB Accredited Business"
              />
            </div>

            <div className="space-y-2">
              <Label>Badge image</Label>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Award className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleUpload(file);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Upload
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPreviewUrl(undefined);
                        setPendingStorageId(undefined);
                        setClearImage(true);
                        setForm((f) => ({ ...f, imagePath: "" }));
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <Input
                value={form.imagePath}
                onChange={(e) => {
                  setForm((f) => ({ ...f, imagePath: e.target.value }));
                  if (e.target.value.startsWith("/")) {
                    setPreviewUrl(e.target.value);
                    setPendingStorageId(undefined);
                    setClearImage(false);
                  }
                }}
                placeholder="/images/bbb-badge.svg (optional static path)"
                className="text-sm"
              />
            </div>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Show in hero</p>
                <p className="text-xs text-muted-foreground">
                  Trust row below the headline
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.showInHero}
                onChange={(e) =>
                  setForm((f) => ({ ...f, showInHero: e.target.checked }))
                }
                className="h-4 w-4 accent-primary"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Show in footer</p>
                <p className="text-xs text-muted-foreground">
                  Credentials column
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.showInFooter}
                onChange={(e) =>
                  setForm((f) => ({ ...f, showInFooter: e.target.checked }))
                }
                className="h-4 w-4 accent-primary"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Visible on site</p>
                <p className="text-xs text-muted-foreground">
                  Turn off to hide without deleting
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(e) =>
                  setForm((f) => ({ ...f, enabled: e.target.checked }))
                }
                className="h-4 w-4 accent-primary"
              />
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete certification?</DialogTitle>
            <DialogDescription>
              This removes the badge from the hero and footer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirm && void handleDelete(deleteConfirm)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
