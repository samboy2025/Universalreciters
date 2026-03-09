import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Lock, Play, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ContentDetail = () => {
  const { id } = useParams();
  const { user, wallet, refreshProfile } = useAuth();
  const [content, setContent] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error: contentError } = await supabase.from("content").select("*").eq("id", id).single();
        if (contentError) throw contentError;
        setContent(data);

        if (data) {
          const { data: prof, error: profError } = await supabase.from("profiles").select("*").eq("user_id", data.owner_id).single();
          if (profError) console.error("Error fetching owner profile:", profError);
          setOwner(prof);
        }

        if (user && data) {
          const { data: unlock, error: unlockError } = await supabase.from("unlocks").select("id").eq("user_id", user.id).eq("content_id", data.id).single();
          if (unlockError && unlockError.code !== "PGRST116") {
            console.error("Error checking unlock status:", unlockError);
          }
          setUnlocked(!!unlock || data.owner_id === user.id);
        }
      } catch (error: any) {
        console.error("Error fetching content detail:", error);
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, user]);

  const handleUnlock = async () => {
    if (!user) { toast.error("Please sign in first"); return; }
    if (!content) return;

    const usePoints = content.price_points > 0;
    if (usePoints && (wallet?.balance_points || 0) < content.price_points) {
      toast.error("Not enough points"); return;
    }
    if (!usePoints && (wallet?.balance_naira || 0) < content.price_naira) {
      toast.error("Not enough funds"); return;
    }

    try {
      const { error: unlockError } = await supabase.from("unlocks").insert({
        user_id: user.id,
        content_id: content.id,
        paid_points: usePoints ? content.price_points : 0,
        paid_naira: usePoints ? 0 : content.price_naira,
      });
      if (unlockError) throw unlockError;

      if (usePoints) {
        const { error: walletError } = await supabase.from("wallets").update({ balance_points: (wallet?.balance_points || 0) - content.price_points }).eq("user_id", user.id);
        if (walletError) throw walletError;
      } else {
        const { error: walletError } = await supabase.from("wallets").update({ balance_naira: (wallet?.balance_naira || 0) - content.price_naira }).eq("user_id", user.id);
        if (walletError) throw walletError;
      }

      const { error: transError } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "unlock" as any,
        amount_points: usePoints ? -content.price_points : 0,
        amount_naira: usePoints ? 0 : -content.price_naira,
        description: `Unlocked: ${content.title}`,
      });
      if (transError) throw transError;

      setUnlocked(true);
      await refreshProfile();
      toast.success("Content unlocked!");
    } catch (err: any) {
      toast.error(err.message || "Failed to unlock");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!content) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Content not found</p></div>;

  const isFree = content.price_points === 0 && Number(content.price_naira) === 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Video Player */}
        <div className="aspect-video bg-primary rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
          {unlocked || isFree ? (
            <div className="text-center text-primary-foreground">
              <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p className="font-body text-sm opacity-70">Video player placeholder</p>
            </div>
          ) : (
            <div className="text-center text-primary-foreground">
              <Lock className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="font-display text-xl font-bold mb-2">Locked Content</p>
              <p className="font-body text-sm opacity-70 mb-4">
                {content.price_points > 0 ? `${content.price_points} points` : `₦${content.price_naira}`} to unlock
              </p>
              <Button variant="hero" onClick={handleUnlock}>Unlock Now</Button>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="bg-card rounded-xl shadow-soft border border-border p-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">{content.title}</h1>
          <p className="text-muted-foreground font-body mb-4">{content.description}</p>

          {owner && (
            <Link to={`/u/${owner.username}`} className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-body font-semibold text-foreground text-sm">{owner.display_name || owner.username}</p>
                <p className="font-body text-xs text-muted-foreground">@{owner.username}</p>
              </div>
            </Link>
          )}

          {content.tags && content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full font-body">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
