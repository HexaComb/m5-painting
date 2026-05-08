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
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Loader2, Pencil, Plus, Save, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type ReviewForm = { text: string; author: string; date: string; source: string };
const emptyForm: ReviewForm = { text: "", author: "", date: "", source: "Yelp" };

export default function ReviewsPage() {
  const reviews = useQuery(api.content.getReviews);
  const updateReview = useMutation(api.content.updateReview);
  const addReview = useMutation(api.content.addReview);
  const deleteReview = useMutation(api.content.deleteReview);
  const [editingId, setEditingId] = useState<Id<"reviews"> | "new" | null>(null);
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"reviews"> | null>(null);

  const openEdit = (review: NonNullable<typeof reviews>[number] | null) => {
    if (review) {
      setEditingId(review._id);
      setForm({ text: review.text, author: review.author, date: review.date, source: review.source });
    } else {
      setEditingId("new");
      setForm({ ...emptyForm });
    }
  };

  const handleSave = async () => {
    if (!form.text.trim() || !form.author.trim()) { toast.error("Review text and author are required"); return; }
    setSaving(true);
    try {
      if (editingId === "new") { await addReview(form); toast.success("Review added!"); }
      else if (editingId) { await updateReview({ id: editingId, ...form }); toast.success("Review updated!"); }
      setEditingId(null);
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: Id<"reviews">) => {
    try { await deleteReview({ id }); toast.success("Review deleted"); setDeleteConfirm(null); }
    catch { toast.error("Failed to delete"); }
  };

  if (reviews === undefined) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Reviews</h1>
            <p className="text-sm text-muted-foreground">{reviews.length} customer testimonials</p>
          </div>
        </div>
        <Button onClick={() => openEdit(null)}><Plus className="mr-2 h-4 w-4" />Add Review</Button>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review._id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">{review.source}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">&ldquo;{review.text}&rdquo;</p>
                  <p className="mt-2 text-sm font-semibold">{review.author} <span className="font-normal text-muted-foreground">· {review.date}</span></p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(review)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(review._id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId === "new" ? "Add Review" : "Edit Review"}</DialogTitle><DialogDescription>Customer testimonial</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Review Text</Label><Textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} rows={4} placeholder="What the customer said..." /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><Label>Author</Label><Input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="John D." /></div>
              <div className="space-y-2"><Label>Date</Label><Input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} placeholder="June 2025" /></div>
              <div className="space-y-2"><Label>Source</Label><Input value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))} placeholder="Yelp" /></div>
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
          <DialogHeader><DialogTitle>Delete Review</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
