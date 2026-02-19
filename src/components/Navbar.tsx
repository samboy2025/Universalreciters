import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-display font-bold text-foreground">Attanzil</span>
          <span className="text-sm font-body text-accent">Universal Reciters</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/explore" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
          <Link to="/recitation-checker" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Recitation Checker</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth"><Button variant="outline" size="sm">Log in</Button></Link>
              <Link to="/auth?mode=signup"><Button variant="gold" size="sm">Sign up</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 space-y-3">
          <Link to="/explore" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Explore</Link>
          <Link to="/recitation-checker" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Recitation Checker</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Log out</Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/auth" onClick={() => setMenuOpen(false)}><Button variant="outline" size="sm">Log in</Button></Link>
              <Link to="/auth?mode=signup" onClick={() => setMenuOpen(false)}><Button variant="gold" size="sm">Sign up</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
