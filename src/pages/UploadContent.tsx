import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const uploadSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().max(500).optional(),
  reciterName: z.string().trim().min(2).max(100),
  surahRef: z.number().int().min(1).max(114).optional(),
  pricePoints: z.number().int().min(0).max(10000),
  priceNaira: z.number().min(0).max(100000),
});

const UploadContent = () => {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    reciterName: "",
    surahRef: "",
    pricePoints: "0",
    priceNaira: "0",
    tags: "",
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;
  if (profile && !profile.is_premium) return <Navigate to="/activate" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const parsed = uploadSchema.parse({
        title: form.title,
        description: form.description,
        reciterName: form.reciterName,
        surahRef: form.surahRef ? parseInt(form.surahRef) : undefined,
        pricePoints: parseInt(form.pricePoints),
        priceNaira: parseFloat(form.priceNaira),
      });

      const { error: insertError } = await supabase.from("content").insert({
        owner_id: user.id,
        title: parsed.title,
        description: parsed.description,
        reciter_name: parsed.reciterName,
        surah_ref: parsed.surahRef,
        price_points: parsed.pricePoints,
        price_naira: parsed.priceNaira,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        video_url: "https://example.com/mock-video.mp4", // Mock
        status: "pending" as any,
      });

      if (insertError) throw insertError;
      toast.success("Content submitted for moderation!");
      navigate("/dashboard");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error(err.message || "Upload failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Upload Content</h1>
        <p className="text-muted-foreground font-body mb-8">Share your recitation with the community and set your price.</p>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-soft border border-border p-8 space-y-5">
          <div>
            <Label className="font-body">Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Surah Al-Baqarah Recitation" required />
          </div>
          <div>
            <Label className="font-body">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your recitation..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body">Reciter Name *</Label>
              <Input value={form.reciterName} onChange={(e) => setForm({ ...form, reciterName: e.target.value })} required />
            </div>
            <div>
              <Label className="font-body">Surah Number</Label>
              <Input type="number" min={1} max={114} value={form.surahRef} onChange={(e) => setForm({ ...form, surahRef: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body">Price (Points)</Label>
              <Input type="number" min={0} value={form.pricePoints} onChange={(e) => setForm({ ...form, pricePoints: e.target.value })} />
            </div>
            <div>
              <Label className="font-body">Price (Naira)</Label>
              <Input type="number" min={0} step="0.01" value={form.priceNaira} onChange={(e) => setForm({ ...form, priceNaira: e.target.value })} />
            </div>
          </div>
          <div>
            <Label className="font-body">Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tajweed, surah, beautiful" />
          </div>

          <div className="bg-muted rounded-xl p-6 text-center border-2 border-dashed border-border">
            <p className="text-sm text-muted-foreground font-body">Video upload will be available soon.</p>
            <p className="text-xs text-muted-foreground font-body mt-1">For now, content is submitted with mock video URL.</p>
          </div>

          <Button variant="gold" size="lg" className="w-full" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadContent;
