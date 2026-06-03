"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
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
import { ArrowLeft, Film, Loader2, Save, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { HeroMediaPreview } from "@/components/sections/hero-media";
import type { HeroMediaType } from "@/lib/content-types";
import {
  DEFAULT_HERO_MEDIA_ALT,
  DEFAULT_HERO_MEDIA_TYPE,
  DEFAULT_HERO_VIDEO,
} from "@/lib/content-types";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function mediaTypeFromFile(file: File): HeroMediaType | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

export default function HeroPage() {
  const hero = useQuery(api.content.getHeroContent);
  const update = useMutation(api.content.updateHeroContent);
  const generateUploadUrl = useMutation(api.content.generateHeroMediaUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    headline: "",
    highlightText: "",
    bodyText: "",
    ctaText: "",
    imageAlt: DEFAULT_HERO_MEDIA_ALT,
  });
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_HERO_VIDEO);
  const [previewType, setPreviewType] = useState<HeroMediaType>(
    DEFAULT_HERO_MEDIA_TYPE,
  );
  const [pendingStorageId, setPendingStorageId] = useState<
    Id<"_storage"> | undefined
  >(undefined);
  const [pendingMediaType, setPendingMediaType] = useState<
    HeroMediaType | undefined
  >(undefined);
  const [clearMedia, setClearMedia] = useState(false);
  const [hasCustomMedia, setHasCustomMedia] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hero) {
      setForm({
        headline: hero.headline,
        highlightText: hero.highlightText,
        bodyText: hero.bodyText,
        ctaText: hero.ctaText,
        imageAlt: hero.mediaAlt ?? DEFAULT_HERO_MEDIA_ALT,
      });
      if (hero.mediaUrl) {
        setPreviewUrl(hero.mediaUrl);
        setPreviewType(hero.mediaType ?? "image");
        setHasCustomMedia(true);
      } else {
        setPreviewUrl(DEFAULT_HERO_VIDEO);
        setPreviewType(DEFAULT_HERO_MEDIA_TYPE);
        setHasCustomMedia(false);
      }
      setPendingStorageId(undefined);
      setPendingMediaType(undefined);
      setClearMedia(false);
    }
  }, [hero]);

  const handleMediaSelect = async (file: File | null) => {
    if (!file) return;

    const mediaType = mediaTypeFromFile(file);
    if (!mediaType) {
      toast.error("Please choose an image or video file");
      return;
    }

    const maxBytes = mediaType === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      toast.error(
        mediaType === "video"
          ? "Video must be 50 MB or smaller"
          : "Image must be 5 MB or smaller",
      );
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
      setPendingMediaType(mediaType);
      setClearMedia(false);
      setHasCustomMedia(true);
      setPreviewType(mediaType);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success(
        `${mediaType === "video" ? "Video" : "Image"} uploaded. Save changes to publish it.`,
      );
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveMedia = () => {
    setPendingStorageId(undefined);
    setPendingMediaType(undefined);
    setClearMedia(true);
    setHasCustomMedia(false);
    setPreviewUrl(DEFAULT_HERO_VIDEO);
    setPreviewType(DEFAULT_HERO_MEDIA_TYPE);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update({
        ...form,
        ...(pendingStorageId && pendingMediaType
          ? { imageStorageId: pendingStorageId, mediaType: pendingMediaType }
          : {}),
        ...(clearMedia ? { clearImage: true } : {}),
      });
      setPendingStorageId(undefined);
      setPendingMediaType(undefined);
      setClearMedia(false);
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
          <CardTitle>Hero Media</CardTitle>
          <CardDescription>
            Image or video shown beside the headline on desktop and below the
            call-to-action buttons on mobile. Defaults to the M5 process video.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="overflow-hidden rounded-xl border bg-muted/30">
            <div className="relative aspect-[6/5] w-full max-w-md sm:aspect-[5/4] lg:aspect-[4/5]">
              <HeroMediaPreview
                src={previewUrl}
                type={previewType}
                alt={form.imageAlt}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleMediaSelect(e.target.files?.[0] ?? null)}
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
              Upload Image or Video
            </Button>
            {hasCustomMedia && (
              <Button
                type="button"
                variant="outline"
                disabled={uploading || saving}
                onClick={handleRemoveMedia}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Use Default Video
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero-media-alt">Description (alt text)</Label>
            <Input
              id="hero-media-alt"
              value={form.imageAlt}
              onChange={(e) =>
                setForm((f) => ({ ...f, imageAlt: e.target.value }))
              }
              placeholder={DEFAULT_HERO_MEDIA_ALT}
            />
            <p className="text-xs text-muted-foreground">
              Describes the media for screen readers and search engines.
            </p>
          </div>

          {!hasCustomMedia && (
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Film className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Using the default process video until you upload custom media.
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
