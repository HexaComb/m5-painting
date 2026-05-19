"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
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
  Instagram,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  isValidInstagramEmbedUrl,
  normalizeInstagramEmbedUrl,
} from "@/lib/instagram";

export default function ProjectsPage() {
  const posts = useQuery(api.content.getInstagramPosts);
  const addPost = useMutation(api.content.addInstagramPost);
  const updatePost = useMutation(api.content.updateInstagramPost);
  const deletePost = useMutation(api.content.deleteInstagramPost);
  const [editingId, setEditingId] = useState<Id<"instagramPosts"> | "new" | null>(
    null,
  );
  const [embedUrl, setEmbedUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"instagramPosts"> | null>(
    null,
  );

  const openEdit = (post: NonNullable<typeof posts>[number] | null) => {
    if (post) {
      setEditingId(post._id);
      setEmbedUrl(post.embedUrl);
    } else {
      setEditingId("new");
      setEmbedUrl("");
    }
  };

  const handleSave = async () => {
    if (!isValidInstagramEmbedUrl(embedUrl)) {
      toast.error(
        "Enter a valid Instagram post or reel URL (e.g. https://www.instagram.com/reel/…)",
      );
      return;
    }
    setSaving(true);
    try {
      if (editingId === "new") {
        await addPost({ embedUrl });
        toast.success("Instagram post added!");
      } else if (editingId) {
        await updatePost({ id: editingId, embedUrl });
        toast.success("Instagram post updated!");
      }
      setEditingId(null);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"instagramPosts">) => {
    try {
      await deletePost({ id });
      toast.success("Instagram post removed");
      setDeleteConfirm(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (posts === undefined) {
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
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-muted-foreground">
              {posts.length} Instagram {posts.length === 1 ? "post" : "posts"} on
              the homepage
            </p>
          </div>
        </div>
        <Button onClick={() => openEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      <Card className="border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Paste the link from Instagram&apos;s share menu (post or reel). Example:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            https://www.instagram.com/reel/ABC123/
          </code>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              No Instagram posts yet. Add your first reel or post above.
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-500/10">
                      <Instagram className="h-4 w-4 text-pink-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{post.embedUrl}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Shown in &ldquo;Projects We&apos;re Proud Of&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(post)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteConfirm(post._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId === "new" ? "Add Instagram Post" : "Edit Instagram Post"}
            </DialogTitle>
            <DialogDescription>
              Paste the embeddable Instagram post or reel URL
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="embedUrl">Instagram URL</Label>
            <Input
              id="embedUrl"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/…"
            />
            {embedUrl.trim() && !isValidInstagramEmbedUrl(embedUrl) && (
              <p className="text-xs text-destructive">
                URL must be an instagram.com post or reel link
              </p>
            )}
            {embedUrl.trim() && isValidInstagramEmbedUrl(embedUrl) && (
              <p className="text-xs text-muted-foreground">
                Will save as: {normalizeInstagramEmbedUrl(embedUrl)}
              </p>
            )}
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

      <Dialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Instagram Post</DialogTitle>
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
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
