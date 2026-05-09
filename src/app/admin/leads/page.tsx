"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Loader2, Mail, Phone, Trash2, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

export default function LeadsPage() {
  const leads = useQuery(api.content.getLeads);
  const markAsRead = useMutation(api.content.markLeadAsRead);
  const deleteLead = useMutation(api.content.deleteLead);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"leads"> | null>(null);

  const handleMarkAsRead = async (id: Id<"leads">) => {
    try { await markAsRead({ id }); toast.success("Marked as read"); }
    catch { toast.error("Failed to update"); }
  };

  const handleDelete = async (id: Id<"leads">) => {
    try { await deleteLead({ id }); toast.success("Lead deleted"); setDeleteConfirm(null); }
    catch { toast.error("Failed to delete"); }
  };

  if (leads === undefined) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const interestLabels: Record<string, string> = {
    interior: "Interior Painting",
    exterior: "Exterior Painting",
    commercial: "Commercial Painting",
    consultation: "Just Want to Talk It Through",
    other: "Something Else",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Leads</h1>
            <p className="text-sm text-muted-foreground">{leads.length} contact form submissions</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {leads.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Mail className="mx-auto mb-3 h-8 w-8 opacity-40" />
              <p>No leads yet. When someone fills out the contact form, submissions will appear here.</p>
            </CardContent>
          </Card>
        )}
        {leads.map((lead) => (
          <Card key={lead._id} className={lead.read ? "opacity-70" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {!lead.read ? (
                      <Circle className="h-3 w-3 fill-primary text-primary" />
                    ) : (
                      <CheckCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="font-semibold text-foreground">{lead.name}</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">{interestLabels[lead.interest] || lead.interest}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{formatDate(lead.createdAt)}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                      <Mail className="h-3.5 w-3.5" />
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <a href={`tel:${lead.phone.replace(/\D/g, "")}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <Phone className="h-3.5 w-3.5" />
                        {lead.phone}
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.message}</p>
                </div>
                <div className="flex gap-1">
                  {!lead.read && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMarkAsRead(lead._id)} title="Mark as read">
                      <CheckCircle className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(lead._id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Lead</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
