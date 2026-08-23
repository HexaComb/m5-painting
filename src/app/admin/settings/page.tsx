"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, RefreshCw, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type SettingsForm = {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  metaDescription: string;
  googlePlaceId: string;
  instagramUsername: string;
};

const emptyForm: SettingsForm = {
  businessName: "",
  tagline: "",
  phone: "",
  email: "",
  address: "",
  metaDescription: "",
  googlePlaceId: "",
  instagramUsername: "",
};

function formatSyncSuccessToast(result: {
  fetched: number;
  imported: number;
  updated: number;
  pruned: number;
}): string {
  return `Synced ${result.fetched} items: ${result.imported} new, ${result.updated} updated, ${result.pruned} removed.`;
}

export default function SettingsPage() {
  const settings = useQuery(api.content.getSiteSettings);
  const update = useMutation(api.content.updateSiteSettings);
  const syncGoogleReviews = useAction(api.googleReviews.syncGoogleReviewsNow);
  const syncInstagramPosts = useAction(api.instagramPosts.syncInstagramPostsNow);
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [syncingReviews, setSyncingReviews] = useState(false);
  const [syncingInstagram, setSyncingInstagram] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        businessName: settings.businessName,
        tagline: settings.tagline,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        metaDescription: settings.metaDescription,
        googlePlaceId: settings.googlePlaceId ?? "",
        instagramUsername: settings.instagramUsername ?? "m5painting",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await update({
        businessName: form.businessName,
        tagline: form.tagline,
        phone: form.phone,
        email: form.email,
        address: form.address,
        metaDescription: form.metaDescription,
        googlePlaceId: form.googlePlaceId,
        instagramUsername: form.instagramUsername,
      });
      toast.success("Site settings updated!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const savedPlaceId = (settings?.googlePlaceId ?? "").trim();
  const formPlaceId = form.googlePlaceId.trim();
  const placeIdDirty = formPlaceId !== savedPlaceId;
  const canSyncReviews =
    savedPlaceId.length > 0 && !placeIdDirty && !syncingReviews && !saving;

  const savedInstagramUsername = (settings?.instagramUsername ?? "").trim();
  const formInstagramUsername = form.instagramUsername.trim();
  const instagramUsernameDirty = formInstagramUsername !== savedInstagramUsername;
  const canSyncInstagram =
    savedInstagramUsername.length > 0 &&
    !instagramUsernameDirty &&
    !syncingInstagram &&
    !saving;

  const handleSyncReviews = async () => {
    if (placeIdDirty) {
      toast.error("Save settings first to sync with this Place ID.");
      return;
    }
    if (!savedPlaceId) {
      toast.error("Add and save a Google Place ID before syncing.");
      return;
    }

    setSyncingReviews(true);
    try {
      const result = await syncGoogleReviews();
      if (result.skipped) {
        toast.error(
          result.skipReason ?? "Add and save a Google Place ID before syncing.",
        );
        return;
      }
      toast.success(
        `Synced ${result.fetched} reviews: ${result.imported} new, ${result.updated} updated, ${result.pruned} removed.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sync Google reviews";
      toast.error(message);
    } finally {
      setSyncingReviews(false);
    }
  };

  const handleSyncInstagram = async () => {
    if (instagramUsernameDirty) {
      toast.error("Save settings first to sync with this Instagram username.");
      return;
    }
    if (!savedInstagramUsername) {
      toast.error("Add and save an Instagram username before syncing.");
      return;
    }

    setSyncingInstagram(true);
    try {
      const result = await syncInstagramPosts();
      if (result.skipped) {
        toast.error(
          result.skipReason ?? "Add and save an Instagram username before syncing.",
        );
        return;
      }
      toast.success(formatSyncSuccessToast(result));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sync Instagram posts";
      toast.error(message);
    } finally {
      setSyncingInstagram(false);
    }
  };

  if (settings === undefined) {
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
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-sm text-muted-foreground">
            Phone, email, and address update across the header, hero, contact section, and
            footer
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Info</CardTitle>
          <CardDescription>
            Single source for phone, email, and location shown site-wide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input
                value={form.businessName}
                onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                placeholder="M5 Painting"
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                placeholder="Family-Owned Since Day One"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="559-451-1022"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="m5paintingco@gmail.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address / Location</Label>
            <Input
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="123 Main St, Sanger, CA 93657 · Central Valley"
            />
            <p className="text-xs text-muted-foreground">
              Use a full street address and ZIP when you have one — it feeds
              LocalBusiness schema for Google. City-only still works
              (e.g. Sanger, CA · Central Valley).
            </p>
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea
              value={form.metaDescription}
              onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
              rows={3}
              placeholder="Sanger painters for homes and businesses across the Central Valley..."
            />
            <p className="text-xs text-muted-foreground">
              Shown in Google search results. Keep it under 160 characters.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Reviews</CardTitle>
          <CardDescription>
            Used for review sync every 10 days and on demand below. Set{" "}
            <code className="text-xs">SERP_API_KEY</code> in your Convex dashboard environment
            variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-place-id">Google Place ID</Label>
            <Input
              id="google-place-id"
              value={form.googlePlaceId}
              onChange={(e) => setForm((f) => ({ ...f, googlePlaceId: e.target.value }))}
              placeholder="ChIJ…"
            />
            <p className="text-xs text-muted-foreground">
              Find this with Google&apos;s Place ID finder or from your Maps business URL. See{" "}
              <code className="text-xs">docs/GOOGLE_REVIEWS.md</code> in the repo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSyncReviews}
              disabled={!canSyncReviews}
            >
              {syncingReviews ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Sync Google reviews
            </Button>
            {placeIdDirty ? (
              <p className="text-xs text-muted-foreground">
                Save settings first to sync with this Place ID.
              </p>
            ) : !savedPlaceId ? (
              <p className="text-xs text-muted-foreground">
                Save a Place ID to enable sync.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instagram Projects</CardTitle>
          <CardDescription>
            Used for reel sync every week and on demand below. Set{" "}
            <code className="text-xs">RAPIDAPI_KEY</code> in your Convex dashboard environment
            variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram-username">Instagram username</Label>
            <Input
              id="instagram-username"
              value={form.instagramUsername}
              onChange={(e) =>
                setForm((f) => ({ ...f, instagramUsername: e.target.value }))
              }
              placeholder="m5painting"
            />
            <p className="text-xs text-muted-foreground">
              Account to pull reels from (without @). See{" "}
              <code className="text-xs">docs/INSTAGRAM_POSTS.md</code> in the repo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSyncInstagram}
              disabled={!canSyncInstagram}
            >
              {syncingInstagram ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Sync Instagram posts
            </Button>
            {instagramUsernameDirty ? (
              <p className="text-xs text-muted-foreground">
                Save settings first to sync with this username.
              </p>
            ) : !savedInstagramUsername ? (
              <p className="text-xs text-muted-foreground">
                Save a username to enable sync.
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
