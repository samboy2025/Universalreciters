import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(30).regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscores only"),
  referralCode: z.string().optional(),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const parsed = signupSchema.parse({ email, password, username, referralCode });
        const { error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            data: { username: parsed.username, referral_code: parsed.referralCode },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
      } else {
        const parsed = loginSchema.parse({ email, password });
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.email,
          password: parsed.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      } else {
        toast.error(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background geometric-pattern">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-elevated border border-border p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                {isSignup ? "Join Attanzil Universal Reciters" : "Sign in to continue"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <Label htmlFor="username" className="font-body">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    required
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email" className="font-body">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-body">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {isSignup && (
                <div>
                  <Label htmlFor="referralCode" className="font-body">Referral Code (optional)</Label>
                  <Input
                    id="referralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="ATR-xxxxxxxx"
                  />
                </div>
              )}
              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                className="text-sm text-accent hover:underline font-body"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
