import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, X, Settings, Users, FileText, DollarSign } from "lucide-react";

const AdminPanel = () => {
  const { user, loading, isAdmin } = useAuth();
  const [tab, setTab] = useState<"content" | "users" | "settings" | "transactions">("content");
  const [pendingContent, setPendingContent] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchData();
  }, [tab, user, isAdmin]);

  const fetchData = async () => {
    try {
      if (tab === "content") {
        const { data, error } = await supabase.from("content").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        setPendingContent(data || []);
      } else if (tab === "users") {
        const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        setUsers(data || []);
      } else if (tab === "settings") {
        const { data, error } = await supabase.from("admin_settings").select("*").single();
        if (error) throw error;
        setSettings(data);
      } else if (tab === "transactions") {
        const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(50);
        if (error) throw error;
        setTransactions(data || []);
      }
    } catch (error: any) {
      console.error(`Error fetching ${tab}:`, error);
      toast.error(`Failed to load ${tab}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  const handleContentAction = async (contentId: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("content").update({ status: status as any }).eq("id", contentId);
    if (error) {
      toast.error(`Failed to ${status} content`);
    } else {
      toast.success(`Content ${status}`);
      fetchData();
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    const { error } = await supabase.from("admin_settings").update({
      points_buy_rate: settings.points_buy_rate,
      points_sell_rate: settings.points_sell_rate,
      activation_fee: settings.activation_fee,
    }).eq("id", settings.id);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved");
    }
    setSavingSettings(false);
  };

  const tabs = [
    { key: "content", label: "Content", icon: FileText },
    { key: "users", label: "Users", icon: Users },
    { key: "transactions", label: "Transactions", icon: DollarSign },
    { key: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-display font-bold text-foreground mb-6">Admin Panel</h1>

        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <Button
              key={t.key}
              variant={tab === t.key ? "gold" : "outline"}
              size="sm"
              onClick={() => setTab(t.key)}
            >
              <t.icon className="w-4 h-4 mr-1" />
              {t.label}
            </Button>
          ))}
        </div>

        {tab === "content" && (
          <div className="space-y-4">
            {pendingContent.length === 0 ? (
              <p className="text-muted-foreground font-body">No content submissions.</p>
            ) : (
              pendingContent.map((item) => (
                <div key={item.id} className="bg-card rounded-xl p-5 border border-border shadow-soft flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground font-body">
                      Status: <span className={item.status === "approved" ? "text-primary" : item.status === "rejected" ? "text-destructive" : "text-accent"}>{item.status}</span>
                    </p>
                  </div>
                  {item.status === "pending" && (
                    <div className="flex gap-2">
                      <Button variant="emerald" size="sm" onClick={() => handleContentAction(item.id, "approved")}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleContentAction(item.id, "rejected")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {tab === "users" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-xs font-body text-muted-foreground uppercase">Username</th>
                  <th className="text-left p-3 text-xs font-body text-muted-foreground uppercase">Premium</th>
                  <th className="text-left p-3 text-xs font-body text-muted-foreground uppercase">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-3 font-body text-sm text-foreground">{u.username}</td>
                    <td className="p-3 font-body text-sm">{u.is_premium ? <span className="text-accent">✓</span> : "—"}</td>
                    <td className="p-3 font-body text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "transactions" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-xs font-body text-muted-foreground uppercase">Type</th>
                  <th className="text-left p-3 text-xs font-body text-muted-foreground uppercase">Naira</th>
                  <th className="text-left p-3 text-xs font-body text-muted-foreground uppercase">Points</th>
                  <th className="text-left p-3 text-xs font-body text-muted-foreground uppercase">Description</th>
                  <th className="text-left p-3 text-xs font-body text-muted-foreground uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="p-3 font-body text-xs text-accent uppercase">{t.type}</td>
                    <td className="p-3 font-body text-sm text-foreground">₦{t.amount_naira}</td>
                    <td className="p-3 font-body text-sm text-foreground">{t.amount_points}</td>
                    <td className="p-3 font-body text-xs text-muted-foreground">{t.description}</td>
                    <td className="p-3 font-body text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "settings" && settings && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-soft max-w-md space-y-4">
            <div>
              <Label className="font-body">Points Buy Rate (₦ per point)</Label>
              <Input type="number" value={settings.points_buy_rate} onChange={(e) => setSettings({ ...settings, points_buy_rate: parseFloat(e.target.value) })} />
            </div>
            <div>
              <Label className="font-body">Points Sell Rate (₦ per point)</Label>
              <Input type="number" value={settings.points_sell_rate} onChange={(e) => setSettings({ ...settings, points_sell_rate: parseFloat(e.target.value) })} />
            </div>
            <div>
              <Label className="font-body">Activation Fee (₦)</Label>
              <Input type="number" value={settings.activation_fee} onChange={(e) => setSettings({ ...settings, activation_fee: parseFloat(e.target.value) })} />
            </div>
            <Button variant="gold" onClick={handleSaveSettings} disabled={savingSettings}>
              {savingSettings ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
