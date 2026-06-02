"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Review } from "@/lib/content-types";

type ReviewForm = {
  text: string;
  author: string;
  date: string;
  source: string;
  rating: number;
};

const emptyForm: ReviewForm = {
  text: "",
  author: "",
  date: "",
  source: "Yelp",
  rating: 5,
};

function isShownOnSite(enabled: boolean | undefined) {
  return enabled !== false;
}

function StarDisplay({ rating }: { rating: number }) {
  const stars = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const reviews = useQuery(api.content.getReviewsAdmin);
  const settings = useQuery(api.content.getSiteSettings);
  const updateReview = useMutation(api.content.updateReview);
  const addReview = useMutation(api.content.addReview);
  const deleteReview = useMutation(api.content.deleteReview);
  const toggleEnabled = useMutation(api.content.toggleReviewEnabled);
  const updateGooglePlaceId = useMutation(api.content.updateGooglePlaceId);
  const syncFromGoogle = useAction(api.googleReviews.syncFromGoogle);

  const [editingId, setEditingId] = useState<Id<"reviews"> | "new" | null>(null);
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"reviews"> | null>(null);
  const [placeId, setPlaceId] = useState("");
  const [savingPlaceId, setSavingPlaceId] = useState(false);

  useEffect(() => {
    if (settings?.googlePlaceId) {
      setPlaceId(settings.googlePlaceId);
    }
  }, [settings?.googlePlaceId]);

  const openEdit = (review: Review | null) => {
    if (review) {
      setEditingId(review._id as Id<"reviews">);
      setForm({
        text: review.text,
        author: review.author,
        date: review.date,
        source: review.source,
        rating: review.rating ?? 5,
      });
    } else {
      setEditingId("new");
      setForm({ ...emptyForm });
    }
  };

  const handleSave = async () => {
    if (!form.text.trim() || !form.author.trim()) {
      toast.error("Review text and author are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        text: form.text,
        author: form.author,
        date: form.date,
        source: form.source,
        rating: form.rating,
      };
      if (editingId === "new") {
        await addReview(payload);
        toast.success("Review added!");
      } else if (editingId) {
        await updateReview({ id: editingId, ...payload });
        toast.success("Review updated!");
      }
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"reviews">) => {
    try {
      await deleteReview({ id });
      toast.success("Review deleted");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSavePlaceId = async () => {
    setSavingPlaceId(true);
    try {
      await updateGooglePlaceId({ googlePlaceId: placeId });
      toast.success("Google Place ID saved");
    } catch {
      toast.error("Failed to save Place ID");
    } finally {
      setSavingPlaceId(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncFromGoogle();
      toast.success(
        `Synced ${result.fetched} newest Google review${result.fetched === 1 ? "" : "s"} (${result.imported} new, ${result.updated} updated). Toggle reviews on to show them on the site.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sync Google reviews";
      toast.error(message);
    } finally {
      setSyncing(false);
    }
  };

  if (reviews === undefined) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const onSiteCount = reviews.filter((r) => isShownOnSite(r.enabled)).length;
  const googleCount = reviews.filter((r) => r.googleReviewId).length;

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
            <h1 className="text-2xl font-bold">Reviews</h1>
            <p className="text-sm text-muted-foreground">
              {onSiteCount} on site · {reviews.length} total
              {googleCount > 0 ? ` · ${googleCount} from Google` : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => openEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Google Reviews</CardTitle>
          <CardDescription>
            Import the 10 newest Google reviews through SerpApi (1–2 SerpApi searches per sync).
            New imports are hidden until you turn them on for the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-place-id">Google Place ID</Label>
            <Input
              id="google-place-id"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              placeholder="ChIJ..."
            />
            <p className="text-xs text-muted-foreground">
              Find this in Google Maps → your business → Share → Embed a map, or use
              Google&apos;s Place ID finder.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleSavePlaceId}
              disabled={savingPlaceId}
            >
              {savingPlaceId ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Place ID
            </Button>
            <Button onClick={handleSync} disabled={syncing || !placeId.trim()}>
              {syncing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Sync from Google
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {reviews.map((review) => {
          const shown = isShownOnSite(review.enabled);
          const isGoogle = Boolean(review.googleReviewId);

          return (
            <Card
              key={review._id}
              className={shown ? "" : "border-dashed opacity-80"}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StarDisplay rating={review.rating ?? 5} />
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                        {review.source}
                      </span>
                      {isGoogle ? (
                        <Badge variant="secondary">Google</Badge>
                      ) : null}
                      {shown ? (
                        <Badge className="bg-green-600/90 hover:bg-green-600/90">
                          On site
                        </Badge>
                      ) : (
                        <Badge variant="outline">Hidden</Badge>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {review.author}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {review.date}
                      </span>
                    </p>
                    {review.authorUri ? (
                      <a
                        href={review.authorUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-brand-blue hover:underline"
                      >
                        View on Google
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={shown ? "Hide from website" : "Show on website"}
                      onClick={() => toggleEnabled({ id: review._id })}
                    >
                      {shown ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(review)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteConfirm(review._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId === "new" ? "Add Review" : "Edit Review"}</DialogTitle>
            <DialogDescription>Customer testimonial</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Review Text</Label>
              <Textarea
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                rows={4}
                placeholder="What the customer said..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  placeholder="John D."
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  placeholder="June 2025"
                />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Input
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                  placeholder="Yelp"
                />
              </div>
              <div className="space-y-2">
                <Label>Star rating</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.rating}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
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

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
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
