import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock, Play } from "lucide-react";

const Explore = () => {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*, profiles!content_owner_id_fkey(username, display_name)")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching content:", error);
      } else {
        setContent(data || []);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Explore Reciters</h1>
        <p className="text-muted-foreground font-body mb-8">Discover beautiful Qur'an recitations from reciters around the world.</p>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl h-64 animate-pulse border border-border" />
            ))}
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body mb-4">No content available yet.</p>
            <Link to="/upload">
              <Button variant="gold">Be the first to upload!</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <Link to={`/content/${item.id}`} key={item.id}>
                <div className="bg-card rounded-xl shadow-soft border border-border overflow-hidden hover:shadow-elevated transition-shadow">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    <Play className="w-12 h-12 text-muted-foreground/30" />
                    {(item.price_points > 0 || item.price_naira > 0) && (
                      <div className="absolute top-3 right-3 bg-accent/90 text-accent-foreground text-xs font-body font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {item.price_points > 0 ? `${item.price_points} pts` : `₦${item.price_naira}`}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground text-lg mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-body">{item.reciter_name}</p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded font-body">{tag}</span>
                        ))}
                      </div>
                    )}
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

export default Explore;
