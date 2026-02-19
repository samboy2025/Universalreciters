import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Activate = () => {
  const { user, loading, profile, refreshProfile } = useAuth();
  const [processing, setProcessing] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;
  if (profile?.is_premium) return <Navigate to="/dashboard" />;

  const handleMockPayment = async () => {
    setProcessing(true);
    try {
      // Mock payment: update wallet, profile, and log transaction
      await supabase.from("profiles").update({ is_premium: true }).eq("user_id", user.id);
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "activation" as any,
        amount_naira: 1000,
        description: "Premium activation payment",
        reference: `ACT-${Date.now()}`,
      });

      // Handle referral bonus
      if (profile?.referred_by) {
        const { data: referrerProfile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("id", profile.referred_by)
          .single();

        if (referrerProfile) {
          await supabase.from("wallets")
            .update({ balance_points: (await supabase.from("wallets").select("balance_points").eq("user_id", referrerProfile.user_id).single()).data?.balance_points + 1 })
            .eq("user_id", referrerProfile.user_id);

          await supabase.from("transactions").insert({
            user_id: referrerProfile.user_id,
            type: "referral_bonus" as any,
            amount_points: 1,
            description: `Referral bonus from ${profile.username}`,
          });

          await supabase.from("referrals")
            .update({ bonus_awarded: true })
            .eq("referred_id", user.id);
        }
      }

      toast.success("Premium activated! Welcome to Attanzil.");
      await refreshProfile();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-2xl shadow-elevated border border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Activate Premium
            </h1>
            <p className="text-muted-foreground font-body mb-8">
              One-time payment of <strong className="text-accent">₦1,000</strong> to unlock all features
            </p>

            <div className="space-y-3 text-left mb-8">
              {[
                "AI-powered recitation checking",
                "Upload & monetize content",
                "Wallet & points system",
                "Referral rewards",
                "Public streaming profile",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm font-body text-foreground">{f}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="xl" className="w-full" onClick={handleMockPayment} disabled={processing}>
              {processing ? "Processing..." : "Pay ₦1,000 — Activate Now"}
            </Button>
            <p className="text-xs text-muted-foreground mt-4 font-body">
              Mock payment mode • Paystack integration coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activate;
