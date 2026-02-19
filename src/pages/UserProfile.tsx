import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { User, Play, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();
      setProfile(prof);

      if (prof) {
        const { data: items } = await supabase
          .from("content")
          .select("*")
          .eq("owner_id", prof.user_id)
          .eq("status", "approved")
          .order("created_at", { ascending: false });
        setContent(items || []);
      }
      setLoading(false);
    };
    fetch();
  }, [username]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">User not found</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-hero rounded-2xl p-8 mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 geometric-pattern opacity-20" />
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-display font-bold text-primary-foreground mb-1">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-primary-foreground/70 font-body text-sm">@{profile.username}</p>
            {profile.bio && <p className="text-primary-foreground/80 font-body text-sm mt-2 max-w-md mx-auto">{profile.bio}</p>}
          </div>
        </div>

        {/* Content Grid */}
        <h2 className="text-xl font-display font-bold text-foreground mb-4">Recitations ({content.length})</h2>
        {content.length === 0 ? (
          <p className="text-muted-foreground font-body">No content published yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {content.map((item) => (
              <Link to={`/content/${item.id}`} key={item.id}>
                <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden hover:shadow-elevated transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <Play className="w-10 h-10 text-muted-foreground/30" />
                    {(item.price_points > 0 || item.price_naira > 0) && (
                      <div className="absolute top-3 right-3 bg-accent/90 text-accent-foreground text-xs font-body font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {item.price_points > 0 ? `${item.price_points} pts` : `₦${item.price_naira}`}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground font-body">{item.reciter_name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
