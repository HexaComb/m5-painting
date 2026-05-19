"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SettingsPage() {
  const settings = useQuery(api.content.getSiteSettings);
  const update = useMutation(api.content.updateSiteSettings);
  const [form, setForm] = useState({ businessName: "", tagline: "", phone: "", email: "", address: "", metaDescription: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({ businessName: settings.businessName, tagline: settings.tagline, phone: settings.phone, email: settings.email, address: settings.address, metaDescription: settings.metaDescription });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try { await update(form); toast.success("Site settings updated!"); }
    catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  if (settings === undefined) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-sm text-muted-foreground">
            Phone, email, and address update across the header, hero, contact section, and footer
          </p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Business Info</CardTitle><CardDescription>Single source for phone, email, and location shown site-wide (header, hero, contact, footer)</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Business Name</Label><Input value={form.businessName} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} placeholder="M5 Painting" /></div>
            <div className="space-y-2"><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="Family-Owned Since Day One" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="559-451-1022" /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="m5paintingco@gmail.com" /></div>
          </div>
          <div className="space-y-2"><Label>Address / Location</Label><Input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Sanger, CA · Central Valley" /></div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} rows={3} placeholder="SEO description for search engines..." />
            <p className="text-xs text-muted-foreground">Shown in Google search results. Keep it under 160 characters.</p>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
