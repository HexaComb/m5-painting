"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Save,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { InstagramPost } from "@/lib/content-types";
import {
  getInstagramPostAdminStatus,
  HOMEPAGE_INSTAGRAM_CAP,
  isInstagramPostPublished,
} from "@/lib/instagram-display";
import {
  isValidInstagramEmbedUrl,
  normalizeInstagramEmbedUrl,
} from "@/lib/instagram";

function StatusBadge({
  post,
  posts,
}: {
  post: InstagramPost;
  posts: InstagramPost[];
}) {
  const status = getInstagramPostAdminStatus(posts, post._id);
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

export default function ProjectsPage() {
  const posts = useQuery(api.content.getInstagramPostsAdmin);
  const addPost = useMutation(api.content.addInstagramPost);
  const updatePost = useMutation(api.content.updateInstagramPost);
  const deletePost = useMutation(api.content.deleteInstagramPost);
  const toggleEnabled = useMutation(api.content.toggleInstagramPostEnabled);

  const [editingId, setEditingId] = useState<Id<"instagramPosts"> | "new" | null>(
    null,
  );
  const [embedUrl, setEmbedUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"instagramPosts"> | null>(
    null,
  );

  const openEdit = (post: InstagramPost | null) => {
    if (post?.instagramMediaId) return;
    if (post) {
      setEditingId(post._id as Id<"instagramPosts">);
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"instagramPosts">) => {
    try {
      await deletePost({ id });
      toast.success("Instagram post removed");
      setDeleteConfirm(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete";
      toast.error(message);
    }
  };

  if (posts === undefined) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const publishedCount = posts.filter((p) => isInstagramPostPublished(p.enabled)).length;
  const homepageCount = Math.min(publishedCount, HOMEPAGE_INSTAGRAM_CAP);
  const importedCount = posts.filter((p) => p.instagramMediaId).length;

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
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-muted-foreground">
              {homepageCount} on homepage · {publishedCount} published · {posts.length}{" "}
              total
              {importedCount > 0 ? ` · ${importedCount} from Instagram sync` : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => openEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Post
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Instagram reels sync weekly, or on demand from{" "}
        <Link href="/admin/settings" className="font-medium text-foreground underline">
          Settings
        </Link>
        . Set your Instagram username there first. Up to {HOMEPAGE_INSTAGRAM_CAP} published
        reels (by order) appear on the homepage.
      </p>

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
            <CardContent className="p-6 text-sm text-muted-foreground">
              No Instagram posts yet. Add a manual reel or run sync from Settings after
              saving your Instagram username.
            </CardContent>
          </Card>
        ) : null}

        {posts.map((post) => {
          const published = isInstagramPostPublished(post.enabled);
          const isImported = Boolean(post.instagramMediaId);

          return (
            <Card
              key={post._id}
              className={published ? "" : "border-dashed opacity-85"}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {post.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.thumbnailUrl}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-pink-500/10">
                        <ImageIcon className="h-5 w-5 text-pink-600" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {isImported ? (
                          <Badge variant="secondary">Instagram sync</Badge>
                        ) : (
                          <Badge variant="outline">Manual</Badge>
                        )}
                        <StatusBadge post={post} posts={posts} />
                      </div>
                      <p className="truncate text-sm font-medium">{post.embedUrl}</p>
                      <a
                        href={post.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-xs text-brand-blue hover:underline"
                      >
                        View on Instagram
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {isImported ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          URL and thumbnail update on the next scheduled sync.
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={published ? "Unpublish" : "Publish"}
                      onClick={() => toggleEnabled({ id: post._id })}
                    >
                      {published ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    {!isImported ? (
                      <>
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
