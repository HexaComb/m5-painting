"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
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
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function HeroPage() {
  const hero = useQuery(api.content.getHeroContent);
  const update = useMutation(api.content.updateHeroContent);
  const [form, setForm] = useState({
    badgeText: "",
    headline: "",
    highlightText: "",
    bodyText: "",
    ctaText: "",
    ctaPhone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hero) {
      setForm({
        badgeText: hero.badgeText,
        headline: hero.headline,
        highlightText: hero.highlightText,
        bodyText: hero.bodyText,
        ctaText: hero.ctaText,
        ctaPhone: hero.ctaPhone,
      });
    }
  }, [hero]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await update(form);
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
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Edit the hero banner text and call-to-action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Badge Text</Label>
            <Input
              value={form.badgeText}
              onChange={(e) =>
                setForm((f) => ({ ...f, badgeText: e.target.value }))
              }
              placeholder="Family-Owned in the Central Valley"
            />
            <p className="text-xs text-muted-foreground">
              Small label shown above the headline
            </p>
          </div>

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

          <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={form.ctaPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ctaPhone: e.target.value }))
                }
                placeholder="559-451-1022"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
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
