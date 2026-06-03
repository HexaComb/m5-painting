"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ImageIcon, Loader2, Save, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_HERO_IMAGE_ALT,
} from "@/lib/content-types";

export default function HeroPage() {
  const hero = useQuery(api.content.getHeroContent);
  const update = useMutation(api.content.updateHeroContent);
  const generateUploadUrl = useMutation(api.content.generateHeroImageUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    headline: "",
    highlightText: "",
    bodyText: "",
    ctaText: "",
    imageAlt: DEFAULT_HERO_IMAGE_ALT,
  });
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_HERO_IMAGE);
  const [pendingStorageId, setPendingStorageId] = useState<
    Id<"_storage"> | undefined
  >(undefined);
  const [clearImage, setClearImage] = useState(false);
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hero) {
      setForm({
        headline: hero.headline,
        highlightText: hero.highlightText,
        bodyText: hero.bodyText,
        ctaText: hero.ctaText,
        imageAlt: hero.imageAlt ?? DEFAULT_HERO_IMAGE_ALT,
      });
      setPreviewUrl(hero.imageUrl ?? DEFAULT_HERO_IMAGE);
      setHasCustomImage(Boolean(hero.imageUrl));
      setPendingStorageId(undefined);
      setClearImage(false);
    }
  }, [hero]);

  const handleImageSelect = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller");
      return;
    }

    setUploading(true);
    try {
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

      setPendingStorageId(storageId);
      setClearImage(false);
      setHasCustomImage(true);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success("Image uploaded. Save changes to publish it.");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setPendingStorageId(undefined);
    setClearImage(true);
    setHasCustomImage(false);
    setPreviewUrl(DEFAULT_HERO_IMAGE);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update({
        ...form,
        ...(pendingStorageId ? { imageStorageId: pendingStorageId } : {}),
        ...(clearImage ? { clearImage: true } : {}),
      });
      setPendingStorageId(undefined);
      setClearImage(false);
      toast.success("Hero section updated!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (hero === undefined) {
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
          <h1 className="text-2xl font-bold">Hero Section</h1>
          <p className="text-sm text-muted-foreground">
            The main banner at the top of your website
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Photo</CardTitle>
          <CardDescription>
            The finished-project photo shown beside the headline on desktop and
            below the call-to-action buttons on mobile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="overflow-hidden rounded-xl border bg-muted/30">
            <div className="relative aspect-[4/3] w-full max-w-md">
              <Image
                src={previewUrl}
                alt={form.imageAlt}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageSelect(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading || saving}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Image
            </Button>
            {hasCustomImage && (
              <Button
                type="button"
                variant="outline"
                disabled={uploading || saving}
                onClick={handleRemoveImage}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Use Default Photo
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-image-alt">Image Description (alt text)</Label>
            <Input
              id="hero-image-alt"
              value={form.imageAlt}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageAlt: e.target.value }))
              }
              placeholder={DEFAULT_HERO_IMAGE_ALT}
            />
            <p className="text-xs text-muted-foreground">
              Describes the photo for screen readers and search engines.
            </p>
          </div>

          {!hasCustomImage && (
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Using the default project photo until you upload a custom image.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Edit the hero banner text and call-to-action. The phone button uses
            the number from{" "}
            <Link href="/admin/settings" className="text-primary underline">
              Site Settings
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              value={form.headline}
              onChange={(e) =>
                setForm((f) => ({ ...f, headline: e.target.value }))
              }
              placeholder="Painting done right,"
            />
          </div>

          <div className="space-y-2">
            <Label>Highlighted Text</Label>
            <Input
              value={form.highlightText}
              onChange={(e) =>
                setForm((f) => ({ ...f, highlightText: e.target.value }))
              }
              placeholder="by people who care."
            />
            <p className="text-xs text-muted-foreground">
              Second line with underline decoration
            </p>
          </div>

          <div className="space-y-2">
            <Label>Body Text</Label>
            <Textarea
              value={form.bodyText}
              onChange={(e) =>
                setForm((f) => ({ ...f, bodyText: e.target.value }))
              }
              rows={3}
              placeholder="We're a family-run crew..."
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Button Text</Label>
            <Input
              value={form.ctaText}
              onChange={(e) =>
                setForm((f) => ({ ...f, ctaText: e.target.value }))
              }
              placeholder="Get a Free Estimate"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
