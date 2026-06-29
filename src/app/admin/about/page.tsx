"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  DEFAULT_ABOUT_IMAGE,
  DEFAULT_ABOUT_IMAGE_ALT,
} from "@/lib/content-types";

const MAX_IMAGE_BYTES = 50 * 1024 * 1024;

export default function AboutPage() {
  const aboutContent = useQuery(api.content.getAboutContent);
  const aboutImages = useQuery(api.content.getAboutImages);
  const aboutValues = useQuery(api.content.getAboutValues);
  const updateAbout = useMutation(api.content.updateAboutContent);
  const generateUploadUrl = useMutation(api.content.generateAboutImageUploadUrl);
  const addAboutImage = useMutation(api.content.addAboutImage);
  const updateAboutImage = useMutation(api.content.updateAboutImage);
  const deleteAboutImage = useMutation(api.content.deleteAboutImage);
  const updateValue = useMutation(api.content.updateAboutValue);
  const addValue = useMutation(api.content.addAboutValue);
  const deleteValue = useMutation(api.content.deleteAboutValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contentForm, setContentForm] = useState({
    subtitle: "",
    title: "",
    paragraphs: [""],
  });
  const [imageAltDrafts, setImageAltDrafts] = useState<Record<string, string>>(
    {},
  );
  const [uploading, setUploading] = useState(false);
  const [savingImageId, setSavingImageId] = useState<Id<"aboutImages"> | null>(
    null,
  );
  const [savingContent, setSavingContent] = useState(false);
  const [editingValueId, setEditingValueId] = useState<Id<"aboutValues"> | "new" | null>(null);
  const [valueForm, setValueForm] = useState({ iconName: "", title: "", description: "" });
  const [savingValue, setSavingValue] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"aboutValues"> | null>(null);

  useEffect(() => {
    if (aboutContent) {
      setContentForm({
        subtitle: aboutContent.subtitle,
        title: aboutContent.title,
        paragraphs: [...aboutContent.paragraphs],
      });
    }
  }, [aboutContent]);

  useEffect(() => {
    if (aboutImages) {
      setImageAltDrafts(
        Object.fromEntries(
          aboutImages.map((image) => [image._id, image.imageAlt]),
        ),
      );
    }
  }, [aboutImages]);

  const handleImageSelect = async (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.length === 0) return;

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/"),
    );
    if (invalidFile) {
      toast.error("Please choose image files only");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_BYTES,
    );
    if (oversizedFile) {
      toast.error("Each image must be 50 MB or smaller");
      return;
    }

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = (await response.json()) as {
          storageId: Id<"_storage">;
        };

        await addAboutImage({
          imageStorageId: storageId,
          imageAlt: DEFAULT_ABOUT_IMAGE_ALT,
        });
      }
      toast.success(
        selectedFiles.length === 1
          ? "Image added to gallery"
          : `${selectedFiles.length} images added to gallery`,
      );
    } catch {
      toast.error("Failed to upload gallery image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveImageAlt = async (id: Id<"aboutImages">, order: number) => {
    setSavingImageId(id);
    try {
      await updateAboutImage({
        id,
        order,
        imageAlt: imageAltDrafts[id] ?? DEFAULT_ABOUT_IMAGE_ALT,
      });
      toast.success("Image description saved");
    } catch {
      toast.error("Failed to save image description");
    } finally {
      setSavingImageId(null);
    }
  };

  const handleMoveImage = async (index: number, direction: -1 | 1) => {
    if (!aboutImages) return;
    const targetIndex = index + direction;
    const image = aboutImages[index];
    const target = aboutImages[targetIndex];
    if (!image || !target) return;

    try {
      await Promise.all([
        updateAboutImage({
          id: image._id,
          order: target.order,
          imageAlt: imageAltDrafts[image._id] ?? image.imageAlt,
        }),
        updateAboutImage({
          id: target._id,
          order: image.order,
          imageAlt: imageAltDrafts[target._id] ?? target.imageAlt,
        }),
      ]);
    } catch {
      toast.error("Failed to reorder image");
    }
  };

  const handleDeleteImage = async (id: Id<"aboutImages">) => {
    try {
      await deleteAboutImage({ id });
      toast.success("Image removed from gallery");
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const handleSaveContent = async () => {
    setSavingContent(true);
    try {
      await updateAbout({
        ...contentForm,
        paragraphs: contentForm.paragraphs.filter((p) => p.trim()),
      });
      toast.success("About section updated!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingContent(false);
    }
  };

  const openValueEdit = (value: NonNullable<typeof aboutValues>[number] | null) => {
    if (value) {
      setEditingValueId(value._id);
      setValueForm({ iconName: value.iconName, title: value.title, description: value.description });
    } else {
      setEditingValueId("new");
      setValueForm({ iconName: "Heart", title: "", description: "" });
    }
  };

  const handleSaveValue = async () => {
    if (!valueForm.title.trim()) { toast.error("Title is required"); return; }
    setSavingValue(true);
    try {
      if (editingValueId === "new") { await addValue(valueForm); toast.success("Value added!"); }
      else if (editingValueId) { await updateValue({ id: editingValueId, ...valueForm }); toast.success("Value updated!"); }
      setEditingValueId(null);
    } catch { toast.error("Failed to save"); } finally { setSavingValue(false); }
  };

  const handleDeleteValue = async (id: Id<"aboutValues">) => {
    try { await deleteValue({ id }); toast.success("Value deleted"); setDeleteConfirm(null); }
    catch { toast.error("Failed to delete"); }
  };

  if (
    aboutContent === undefined ||
    aboutImages === undefined ||
    aboutValues === undefined
  ) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold">About Section</h1>
          <p className="text-sm text-muted-foreground">Company story and core values</p>
        </div>
      </div>

      {/* About Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>About Gallery</CardTitle>
          <CardDescription>
            Images shown as a carousel beside the company story. If no images
            are uploaded, the site uses the default team collage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageSelect(e.target.files)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading || savingContent}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Images
            </Button>
          </div>

          {aboutImages.length > 0 ? (
            <div className="space-y-3">
              {aboutImages.map((image, index) => (
                <div
                  key={image._id}
                  className="grid gap-4 rounded-lg border p-3 sm:grid-cols-[120px_1fr]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                    <Image
                      src={image.imageUrl}
                      alt={image.imageAlt}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`about-image-alt-${image._id}`}>
                        Description (alt text)
                      </Label>
                      <Input
                        id={`about-image-alt-${image._id}`}
                        value={imageAltDrafts[image._id] ?? ""}
                        onChange={(e) =>
                          setImageAltDrafts((drafts) => ({
                            ...drafts,
                            [image._id]: e.target.value,
                          }))
                        }
                        placeholder={DEFAULT_ABOUT_IMAGE_ALT}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={savingImageId === image._id}
                        onClick={() => handleSaveImageAlt(image._id, image.order)}
                      >
                        {savingImageId === image._id ? (
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-3.5 w-3.5" />
                        )}
                        Save Description
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => handleMoveImage(index, -1)}
                      >
                        <ArrowUp className="mr-2 h-3.5 w-3.5" />
                        Move Up
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={index === aboutImages.length - 1}
                        onClick={() => handleMoveImage(index, 1)}
                      >
                        <ArrowDown className="mr-2 h-3.5 w-3.5" />
                        Move Down
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteImage(image._id)}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="mb-3 text-sm text-muted-foreground">
                No gallery images yet. The site is currently using this fallback
                image.
              </p>
              <div className="relative aspect-[3/4] w-full max-w-[160px] overflow-hidden rounded-md bg-muted">
                <Image
                  src={aboutContent?.imageUrl ?? DEFAULT_ABOUT_IMAGE}
                  alt={aboutContent?.imageAlt ?? DEFAULT_ABOUT_IMAGE_ALT}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Story */}
      <Card>
        <CardHeader><CardTitle>Company Story</CardTitle><CardDescription>The main about text shown on your website</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Subtitle</Label><Input value={contentForm.subtitle} onChange={(e) => setContentForm((f) => ({ ...f, subtitle: e.target.value }))} placeholder="The Family Behind Every Coat" /></div>
          <div className="space-y-2"><Label>Title</Label><Input value={contentForm.title} onChange={(e) => setContentForm((f) => ({ ...f, title: e.target.value }))} placeholder="Built on Hard Work & Handshakes" /></div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Story Paragraphs</Label>
              <Button variant="outline" size="sm" onClick={() => setContentForm((f) => ({ ...f, paragraphs: [...f.paragraphs, ""] }))}>
                <Plus className="mr-1 h-3 w-3" />Add Paragraph
              </Button>
            </div>
            {contentForm.paragraphs.map((para, idx) => (
              <div key={idx} className="flex gap-2">
                <Textarea value={para} onChange={(e) => setContentForm((f) => ({ ...f, paragraphs: f.paragraphs.map((p, i) => i === idx ? e.target.value : p) }))} rows={3} placeholder="Write a paragraph..." />
                {contentForm.paragraphs.length > 1 && (
                  <Button variant="ghost" size="icon" className="mt-1 shrink-0" onClick={() => setContentForm((f) => ({ ...f, paragraphs: f.paragraphs.filter((_, i) => i !== idx) }))}><X className="h-4 w-4" /></Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveContent} disabled={savingContent || uploading}>
              {savingContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save About Section
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Core Values */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div><CardTitle>Core Values</CardTitle><CardDescription>{aboutValues.length} values</CardDescription></div>
            <Button size="sm" onClick={() => openValueEdit(null)}><Plus className="mr-2 h-4 w-4" />Add Value</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {aboutValues.map((value) => (
            <div key={value._id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex-1">
                <p className="font-medium">{value.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{value.description}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openValueEdit(value)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(value._id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={editingValueId !== null} onOpenChange={(open) => !open && setEditingValueId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingValueId === "new" ? "Add Value" : "Edit Value"}</DialogTitle><DialogDescription>Core values shown on the website</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Title</Label><Input value={valueForm.title} onChange={(e) => setValueForm((f) => ({ ...f, title: e.target.value }))} placeholder="We Care Like Family" /></div>
              <div className="space-y-2"><Label>Icon Name</Label><Input value={valueForm.iconName} onChange={(e) => setValueForm((f) => ({ ...f, iconName: e.target.value }))} placeholder="Heart" /></div>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={valueForm.description} onChange={(e) => setValueForm((f) => ({ ...f, description: e.target.value }))} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingValueId(null)}>Cancel</Button>
            <Button onClick={handleSaveValue} disabled={savingValue}>
              {savingValue ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Value</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDeleteValue(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
