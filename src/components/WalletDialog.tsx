import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface WalletDialogProps {
  type: "fund" | "buy_points" | "sell_points" | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletDialog({ type, open, onOpenChange }: WalletDialogProps) {
  const { user, wallet, refreshProfile } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setAmount("");
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from("admin_settings").select("*").single();
    if (error) {
      console.error("Error fetching settings:", error);
    } else {
      setSettings(data);
    }
  };

  const handleAction = async () => {
    if (!user || !wallet || !type) return;
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      if (type === "fund") {
        // Mock payment success
        const { error: walletErr } = await supabase
          .from("wallets")
          .update({ balance_naira: (wallet.balance_naira || 0) + val })
          .eq("user_id", user.id);
        if (walletErr) throw walletErr;

        const { error: transErr } = await supabase.from("transactions").insert({
          user_id: user.id,
          type: "fund",
          amount_naira: val,
          description: `Funded wallet with ₦${val}`,
        });
        if (transErr) throw transErr;

        toast.success(`Successfully funded wallet with ₦${val}`);
      } else if (type === "buy_points") {
        const rate = settings?.points_buy_rate || 10; // Default 10 Naira per point
        const cost = val * rate;

        if ((wallet.balance_naira || 0) < cost) {
          throw new Error(`Insufficient Naira balance. You need ₦${cost} for ${val} points.`);
        }

        const { error: walletErr } = await supabase
          .from("wallets")
          .update({
            balance_naira: (wallet.balance_naira || 0) - cost,
            balance_points: (wallet.balance_points || 0) + val,
          })
          .eq("user_id", user.id);
        if (walletErr) throw walletErr;

        const { error: transErr } = await supabase.from("transactions").insert({
          user_id: user.id,
          type: "buy_points",
          amount_naira: -cost,
          amount_points: val,
          description: `Bought ${val} points at ₦${rate}/pt`,
        });
        if (transErr) throw transErr;

        toast.success(`Successfully bought ${val} points`);
      } else if (type === "sell_points") {
        const rate = settings?.points_sell_rate || 8; // Default 8 Naira per point
        const gain = val * rate;

        if ((wallet.balance_points || 0) < val) {
          throw new Error(`Insufficient points. You only have ${wallet.balance_points} points.`);
        }

        const { error: walletErr } = await supabase
          .from("wallets")
          .update({
            balance_naira: (wallet.balance_naira || 0) + gain,
            balance_points: (wallet.balance_points || 0) - val,
          })
          .eq("user_id", user.id);
        if (walletErr) throw walletErr;

        const { error: transErr } = await supabase.from("transactions").insert({
          user_id: user.id,
          type: "sell_points",
          amount_naira: gain,
          amount_points: -val,
          description: `Sold ${val} points at ₦${rate}/pt`,
        });
        if (transErr) throw transErr;

        toast.success(`Successfully sold ${val} points for ₦${gain}`);
      }

      await refreshProfile();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (type === "fund") return "Fund Wallet";
    if (type === "buy_points") return "Buy Points";
    if (type === "sell_points") return "Sell Points";
    return "";
  };

  const getDescription = () => {
    if (type === "fund") return "Enter the amount in Naira you want to add to your wallet.";
    if (type === "buy_points") return `Enter the number of points you want to buy. Current rate: ₦${settings?.points_buy_rate || 10} per point.`;
    if (type === "sell_points") return `Enter the number of points you want to sell. Current rate: ₦${settings?.points_sell_rate || 8} per point.`;
    return "";
  };

  const getLabel = () => {
    if (type === "fund") return "Amount (₦)";
    return "Number of Points";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              {getLabel()}
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="0"
            />
          </div>
          {type === "buy_points" && amount && !isNaN(parseFloat(amount)) && (
            <p className="text-sm text-muted-foreground text-center">
              Total Cost: ₦{(parseFloat(amount) * (settings?.points_buy_rate || 10)).toLocaleString()}
            </p>
          )}
          {type === "sell_points" && amount && !isNaN(parseFloat(amount)) && (
            <p className="text-sm text-muted-foreground text-center">
              Total Gain: ₦{(parseFloat(amount) * (settings?.points_sell_rate || 8)).toLocaleString()}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleAction} disabled={loading} variant="gold">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
