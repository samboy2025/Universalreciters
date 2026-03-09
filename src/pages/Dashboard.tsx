import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Wallet, Upload, Mic, Users, History, Crown, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, loading, profile, wallet } = useAuth();
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [myContent, setMyContent] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: attempts } = await supabase
        .from("recitation_attempts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      setRecentAttempts(attempts || []);

      const { data: content } = await supabase
        .from("content")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      setMyContent(content || []);
    };

    fetchData();
  }, [user]);

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
              <Link to="/dashboard/wallet">
                <Button variant="gold" size="sm">Manage Wallet</Button>
              </Link>
            </div>
          </div>

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Attempts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-foreground">Recent Attempts</h2>
              <Link to="/recitation-checker" className="text-xs text-accent hover:underline font-body">New Check</Link>
            </div>
            {recentAttempts.length === 0 ? (
              <div className="bg-card rounded-xl p-8 border border-border text-center">
                <p className="text-sm text-muted-foreground font-body">No attempts yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => (
                  <div key={attempt.id} className="bg-card rounded-xl p-4 border border-border shadow-soft flex items-center justify-between">
                    <div>
                      <p className="text-sm font-display font-bold text-foreground">Surah {attempt.matched_surah}</p>
                      <p className="text-xs text-muted-foreground font-body">Score: {attempt.score}/100</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-body">{new Date(attempt.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-foreground">My Content</h2>
              <Link to="/upload" className="text-xs text-accent hover:underline font-body">Upload New</Link>
            </div>
            {myContent.length === 0 ? (
              <div className="bg-card rounded-xl p-8 border border-border text-center">
                <p className="text-sm text-muted-foreground font-body">You haven't uploaded anything yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myContent.map((item) => (
                  <Link key={item.id} to={`/content/${item.id}`} className="block">
                    <div className="bg-card rounded-xl p-4 border border-border shadow-soft flex items-center gap-4 hover:border-accent transition-colors">
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <Play className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display font-bold text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground font-body capitalize">{item.status}</p>
                      </div>
                      <p className="text-xs font-body font-bold text-foreground">
                        {item.price_points > 0 ? `${item.price_points} pts` : `₦${item.price_naira}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
