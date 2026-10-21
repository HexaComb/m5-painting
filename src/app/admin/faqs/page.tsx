"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { ArrowDown, ArrowLeft, ArrowUp, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultFaqs } from "@/lib/default-content";

type FaqForm = { question: string; answer: string };
const emptyForm: FaqForm = { question: "", answer: "" };

export default function FaqsPage() {
  const faqs = useQuery(api.content.getFaqs);
  const addFaq = useMutation(api.content.addFaq);
  const updateFaq = useMutation(api.content.updateFaq);
  const deleteFaq = useMutation(api.content.deleteFaq);
  const reorderFaqs = useMutation(api.content.reorderFaqs);
  const ensureDefaults = useMutation(api.content.ensureDefaultFaqs);
  const seededRef = useRef(false);
  const [editingId, setEditingId] = useState<Id<"faqs"> | "new" | null>(null);
  const [form, setForm] = useState<FaqForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (faqs === undefined || faqs.length > 0 || seededRef.current) return;
    seededRef.current = true;
    ensureDefaults({ defaults: defaultFaqs.map(({ question, answer }) => ({ question, answer })) }).catch(() => {
      seededRef.current = false;
      toast.error("Failed to load the starter FAQs");
    });
  }, [faqs, ensureDefaults]);

  const openEdit = (faq?: NonNullable<typeof faqs>[number]) => {
    setEditingId(faq?._id ?? "new");
    setForm(faq ? { question: faq.question, answer: faq.answer } : emptyForm);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    setSaving(true);
    try {
      const cleanForm = { question: form.question.trim(), answer: form.answer.trim() };
      if (editingId === "new") {
        await addFaq(cleanForm);
        toast.success("FAQ added");
      } else if (editingId) {
        await updateFaq({ id: editingId, ...cleanForm });
        toast.success("FAQ updated");
      }
      setEditingId(null);
    } catch {
      toast.error("Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"faqs">) => {
    try {
      await deleteFaq({ id });
      toast.success("FAQ deleted");
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  const moveFaq = async (index: number, direction: -1 | 1) => {
    if (!faqs) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= faqs.length) return;
    const ordered = [...faqs];
    [ordered[index], ordered[nextIndex]] = [ordered[nextIndex], ordered[index]];
    try {
      await reorderFaqs({ orderedIds: ordered.map((faq) => faq._id) });
    } catch {
      toast.error("Failed to reorder FAQs");
    }
  };

  if (faqs === undefined) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
            <p className="text-sm text-muted-foreground">Edit the questions and answers shown on the homepage.</p>
          </div>
        </div>
        <Button onClick={() => openEdit()}><Plus className="mr-2 h-4 w-4" />Add FAQ</Button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <Card key={faq._id}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex flex-col">
                <Button variant="ghost" size="icon" aria-label="Move FAQ up" disabled={index === 0} onClick={() => moveFaq(index, -1)}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" aria-label="Move FAQ down" disabled={index === faqs.length - 1} onClick={() => moveFaq(index, 1)}><ArrowDown className="h-4 w-4" /></Button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{faq.question}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{faq.answer}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" aria-label="Edit FAQ" onClick={() => openEdit(faq)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete FAQ" onClick={() => handleDelete(faq._id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId === "new" ? "Add FAQ" : "Edit FAQ"}</DialogTitle>
            <DialogDescription>Update the question and its answer on the homepage.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Question</Label><Input autoFocus value={form.question} onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))} /></div>
            <div className="space-y-2"><Label>Answer</Label><Textarea rows={7} value={form.answer} onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
