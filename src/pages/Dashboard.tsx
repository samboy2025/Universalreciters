import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Wallet, Upload, Mic, Users, History, Crown } from "lucide-react";
import { useState } from "react";
import { WalletDialog } from "@/components/WalletDialog";

const Dashboard = () => {
  const { user, loading, profile, wallet } = useAuth();
  const [walletAction, setWalletAction] = useState<"fund" | "buy_points" | "sell_points" | null>(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;

  if (profile && !profile.is_premium) {
    return <Navigate to="/activate" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Welcome, {profile?.display_name || profile?.username || "Reciter"}
          </h1>
          <p className="text-muted-foreground font-body">Your recitation dashboard</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-display font-bold text-foreground">Wallet</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Naira Balance</p>
                <p className="text-2xl font-body font-bold text-foreground">₦{Number(wallet?.balance_naira || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Points Balance</p>
                <p className="text-2xl font-body font-bold text-accent">{wallet?.balance_points || 0}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="gold" size="sm" onClick={() => setWalletAction("fund")}>Fund Wallet</Button>
              <Button variant="outline" size="sm" onClick={() => setWalletAction("buy_points")}>Buy Points</Button>
              <Button variant="outline" size="sm" onClick={() => setWalletAction("sell_points")}>Sell Points</Button>
            </div>
          </div>

          <WalletDialog
            type={walletAction}
            open={!!walletAction}
            onOpenChange={(open) => !open && setWalletAction(null)}
          />

          <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-display font-bold text-foreground">Referrals</h2>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-3">Share your referral code and earn points!</p>
            <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
              <code className="text-sm font-body font-mono text-foreground">{profile?.referral_code || "..."}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/auth?mode=signup&ref=${profile?.referral_code}`);
                }}
              >
                Copy Link
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/recitation-checker">
            <div className="bg-card rounded-xl p-5 shadow-soft border border-border hover:shadow-elevated transition-shadow cursor-pointer">
              <Mic className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-display font-bold text-foreground">Recitation Checker</h3>
              <p className="text-xs text-muted-foreground font-body mt-1">Check your recitation accuracy</p>
            </div>
          </Link>
          <Link to="/upload">
            <div className="bg-card rounded-xl p-5 shadow-soft border border-border hover:shadow-elevated transition-shadow cursor-pointer">
              <Upload className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-display font-bold text-foreground">Upload Content</h3>
              <p className="text-xs text-muted-foreground font-body mt-1">Share your recitations</p>
            </div>
          </Link>
          <Link to="/explore">
            <div className="bg-card rounded-xl p-5 shadow-soft border border-border hover:shadow-elevated transition-shadow cursor-pointer">
              <Crown className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-display font-bold text-foreground">Explore</h3>
              <p className="text-xs text-muted-foreground font-body mt-1">Discover amazing reciters</p>
            </div>
          </Link>
          <Link to="/dashboard/history">
            <div className="bg-card rounded-xl p-5 shadow-soft border border-border hover:shadow-elevated transition-shadow cursor-pointer">
              <History className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-display font-bold text-foreground">History</h3>
              <p className="text-xs text-muted-foreground font-body mt-1">View transaction log</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
