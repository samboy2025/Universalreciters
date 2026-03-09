import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, RefreshCcw, History } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Wallet = () => {
  const { user, loading, wallet, refreshProfile } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [pointsToBuy, setPointsToBuy] = useState("");
  const [pointsToSell, setPointsToSell] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("admin_settings").select("*").single();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setProcessing(true);
    try {
      const newBalance = (Number(wallet?.balance_naira) || 0) + amount;

      const { error: walletError } = await supabase
        .from("wallets")
        .update({ balance_naira: newBalance })
        .eq("user_id", user.id);

      if (walletError) throw walletError;

      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "fund",
        amount_naira: amount,
        description: `Deposited ₦${amount.toLocaleString()} into wallet`,
        reference: `DEP-${Date.now()}`
      });

      toast.success(`Successfully deposited ₦${amount.toLocaleString()}`);
      setDepositAmount("");
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.message || "Deposit failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleBuyPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    const points = parseInt(pointsToBuy);
    if (isNaN(points) || points <= 0 || !settings) return;

    const cost = points * settings.points_buy_rate;
    if ((wallet?.balance_naira || 0) < cost) {
      toast.error("Insufficient Naira balance");
      return;
    }

    setProcessing(true);
    try {
      const newNaira = (wallet?.balance_naira || 0) - cost;
      const newPoints = (wallet?.balance_points || 0) + points;

      await supabase.from("wallets").update({
        balance_naira: newNaira,
        balance_points: newPoints
      }).eq("user_id", user.id);

      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "buy_points",
        amount_naira: -cost,
        amount_points: points,
        description: `Bought ${points} points`
      });

      toast.success(`Successfully bought ${points} points`);
      setPointsToBuy("");
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.message || "Purchase failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleSellPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    const points = parseInt(pointsToSell);
    if (isNaN(points) || points <= 0 || !settings) return;

    if ((wallet?.balance_points || 0) < points) {
      toast.error("Insufficient points balance");
      return;
    }

    const value = points * settings.points_sell_rate;
    setProcessing(true);
    try {
      const newNaira = (wallet?.balance_naira || 0) + value;
      const newPoints = (wallet?.balance_points || 0) - points;

      await supabase.from("wallets").update({
        balance_naira: newNaira,
        balance_points: newPoints
      }).eq("user_id", user.id);

      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "sell_points",
        amount_naira: value,
        amount_points: -points,
        description: `Sold ${points} points`
      });

      toast.success(`Successfully sold ${points} points for ₦${value.toLocaleString()}`);
      setPointsToSell("");
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.message || "Sale failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">My Wallet</h1>
            <p className="text-muted-foreground font-body">Manage your funds and recitation points</p>
          </div>
          <Link to="/dashboard/history">
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </Link>
        </div>

        {/* Balance Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <WalletIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-body uppercase tracking-wider">Naira Balance</p>
                <p className="text-3xl font-body font-bold text-foreground">₦{Number(wallet?.balance_naira || 0).toLocaleString()}</p>
              </div>
            </div>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <Label htmlFor="deposit" className="text-xs font-semibold uppercase text-muted-foreground">Deposit Funds (₦)</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="deposit"
                    type="number"
                    placeholder="1000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                  <Button type="submit" variant="gold" disabled={processing || !depositAmount}>
                    <ArrowDownLeft className="w-4 h-4 mr-1" /> Deposit
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Mock payment: instantly adds funds to your balance.</p>
              </div>
            </form>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <RefreshCcw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-body uppercase tracking-wider">Points Balance</p>
                <p className="text-3xl font-body font-bold text-accent">{wallet?.balance_points || 0}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Buy Rate</p>
                <p className="font-body font-bold">₦{settings?.points_buy_rate || 0} / pt</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Sell Rate</p>
                <p className="font-body font-bold">₦{settings?.points_sell_rate || 0} / pt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
              Buy Points
            </h3>
            <form onSubmit={handleBuyPoints} className="space-y-4">
              <div>
                <Label className="text-xs">Points to purchase</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={pointsToBuy}
                  onChange={(e) => setPointsToBuy(e.target.value)}
                />
                {pointsToBuy && settings && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Cost: <span className="font-bold text-foreground">₦{(parseInt(pointsToBuy) * settings.points_buy_rate).toLocaleString()}</span>
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" variant="emerald" disabled={processing || !pointsToBuy}>
                Confirm Purchase
              </Button>
            </form>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-accent" />
              Sell Points
            </h3>
            <form onSubmit={handleSellPoints} className="space-y-4">
              <div>
                <Label className="text-xs">Points to sell</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={pointsToSell}
                  onChange={(e) => setPointsToSell(e.target.value)}
                />
                {pointsToSell && settings && (
                  <p className="text-xs text-muted-foreground mt-2">
                    You receive: <span className="font-bold text-foreground">₦{(parseInt(pointsToSell) * settings.points_sell_rate).toLocaleString()}</span>
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" variant="gold" disabled={processing || !pointsToSell}>
                Confirm Sale
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
