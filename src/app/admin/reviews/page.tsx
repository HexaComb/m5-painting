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
import { Badge } from "@/components/ui/badge";
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
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Save,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Review } from "@/lib/content-types";
import {
  getReviewAdminStatus,
  HOMEPAGE_REVIEW_CAP,
  isReviewPublished,
} from "@/lib/review-display";

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

function StatusBadge({ review, reviews }: { review: Review; reviews: Review[] }) {
  const status = getReviewAdminStatus(reviews, review._id);
  if (status === "homepage") {
    return (
      <Badge className="bg-green-600/90 hover:bg-green-600/90">On homepage</Badge>
    );
  }
  if (status === "published_overflow") {
    return <Badge variant="secondary">Published (not on homepage)</Badge>;
  }
  return <Badge variant="outline">Hidden</Badge>;
}

export default function ReviewsPage() {
  const reviews = useQuery(api.content.getReviewsAdmin);
  const updateReview = useMutation(api.content.updateReview);
  const addReview = useMutation(api.content.addReview);
  const deleteReview = useMutation(api.content.deleteReview);
  const toggleEnabled = useMutation(api.content.toggleReviewEnabled);

  const [editingId, setEditingId] = useState<Id<"reviews"> | "new" | null>(null);
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"reviews"> | null>(null);

  const openEdit = (review: Review | null) => {
    if (review?.googleReviewId) return;
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"reviews">) => {
    try {
      await deleteReview({ id });
      toast.success("Review deleted");
      setDeleteConfirm(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete";
      toast.error(message);
    }
  };

  if (reviews === undefined) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const publishedCount = reviews.filter((r) => isReviewPublished(r.enabled)).length;
  const homepageCount = Math.min(publishedCount, HOMEPAGE_REVIEW_CAP);
  const googleCount = reviews.filter((r) => r.googleReviewId).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Reviews</h1>
            <p className="text-sm text-muted-foreground">
              {homepageCount} on homepage · {publishedCount} published · {reviews.length}{" "}
              total
              {googleCount > 0 ? ` · ${googleCount} from Google` : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => openEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Google reviews sync every 10 days, or on demand from{" "}
        <Link href="/admin/settings" className="font-medium text-foreground underline">
          Settings
        </Link>
        . Add your Place ID there first. Up to {HOMEPAGE_REVIEW_CAP} published reviews (by
        order) appear on the homepage.
      </p>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No reviews yet. Add a manual review or wait for the next Google sync after you
              save a Place ID in Settings.
            </CardContent>
          </Card>
        ) : null}

        {reviews.map((review) => {
          const published = isReviewPublished(review.enabled);
          const isGoogle = Boolean(review.googleReviewId);

          return (
            <Card
              key={review._id}
              className={published ? "" : "border-dashed opacity-85"}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StarDisplay rating={review.rating ?? 5} />
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">
                        {review.source}
                      </span>
                      {isGoogle ? <Badge variant="secondary">Google</Badge> : null}
                      <StatusBadge review={review} reviews={reviews} />
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
                    {isGoogle && review.authorUri ? (
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
                    {isGoogle ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Text updates on the next scheduled Google sync.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={published ? "Unpublish" : "Publish"}
                      onClick={() => toggleEnabled({ id: review._id })}
                    >
                      {published ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    {!isGoogle ? (
                      <>
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
                      </>
                    ) : null}
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
            <DialogDescription>Manual testimonial (Yelp, Angi, etc.)</DialogDescription>
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
