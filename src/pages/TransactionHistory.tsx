import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TransactionHistory = () => {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setTransactions(data || []);
    };
    fetch();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;

  const typeColors: Record<string, string> = {
    fund: "text-primary",
    activation: "text-accent",
    buy_points: "text-accent",
    sell_points: "text-primary",
    unlock: "text-destructive",
    referral_bonus: "text-primary",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-6">Transaction History</h1>

        {transactions.length === 0 ? (
          <p className="text-muted-foreground font-body">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="bg-card rounded-xl p-4 border border-border shadow-soft flex items-center justify-between">
                <div>
                  <p className={`text-xs font-body font-semibold uppercase ${typeColors[t.type] || "text-foreground"}`}>{t.type.replace("_", " ")}</p>
                  <p className="text-sm text-muted-foreground font-body">{t.description}</p>
                </div>
                <div className="text-right">
                  {t.amount_naira !== 0 && <p className="font-body font-semibold text-foreground">₦{t.amount_naira}</p>}
                  {t.amount_points !== 0 && <p className="font-body text-sm text-accent">{t.amount_points > 0 ? "+" : ""}{t.amount_points} pts</p>}
                  <p className="text-xs text-muted-foreground font-body">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
