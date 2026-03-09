import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Mic, Upload, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RecitationChecker = () => {
  const { user, loading, profile } = useAuth();
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("recitation_attempts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setHistory(data || []);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/auth" />;
  if (profile && !profile.is_premium) return <Navigate to="/activate" />;

  const handleMockCheck = async () => {
    setProcessing(true);
    // Simulate ASR + matching
    await new Promise((r) => setTimeout(r, 2000));

    const mockResult = {
      matched_surah: 1,
      matched_ayah_start: 1,
      matched_ayah_end: 7,
      surah_name: "Al-Fatiha",
      score: 87,
      confidence: 92.5,
      breakdown: {
        words: [
          { word: "بِسْمِ", status: "correct" },
          { word: "اللَّهِ", status: "correct" },
          { word: "الرَّحْمَنِ", status: "correct" },
          { word: "الرَّحِيمِ", status: "correct" },
          { word: "الْحَمْدُ", status: "correct" },
          { word: "لِلَّهِ", status: "missed" },
          { word: "رَبِّ", status: "correct" },
          { word: "الْعَالَمِينَ", status: "extra" },
        ],
      },
    };

    setResult(mockResult);

    await supabase.from("recitation_attempts").insert({
      user_id: user.id,
      transcript: "بسم الله الرحمن الرحيم الحمد رب العالمين",
      matched_surah: mockResult.matched_surah,
      matched_ayah_start: mockResult.matched_ayah_start,
      matched_ayah_end: mockResult.matched_ayah_end,
      score: mockResult.score,
      confidence: mockResult.confidence,
      breakdown: mockResult.breakdown,
    });

    setProcessing(false);
    toast.success("Recitation analyzed!");
    fetchHistory();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Recitation Checker</h1>
        <p className="text-muted-foreground font-body mb-8">Record or upload your recitation for AI-powered accuracy scoring.</p>

        <div className="bg-card rounded-2xl shadow-soft border border-border p-8 mb-8">
          <div className="flex flex-col items-center gap-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${recording ? 'bg-destructive/20 animate-pulse' : 'bg-accent/20'}`}>
              <Mic className={`w-10 h-10 ${recording ? 'text-destructive' : 'text-accent'}`} />
            </div>

            <div className="flex gap-4">
              <Button
                variant={recording ? "destructive" : "gold"}
                size="lg"
                onClick={() => {
                  if (recording) {
                    setRecording(false);
                    handleMockCheck();
                  } else {
                    setRecording(true);
                    toast.info("Recording started (mock)...");
                  }
                }}
              >
                {recording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button variant="outline" size="lg" onClick={handleMockCheck} disabled={processing}>
                <Upload className="w-4 h-4 mr-2" />
                {processing ? "Analyzing..." : "Upload Audio"}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="w-3 h-3" />
              <span className="font-body">Mock ASR mode — real speech recognition integration coming soon</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-card rounded-2xl shadow-elevated border border-border p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">Results</h2>
                <p className="text-sm text-muted-foreground font-body">
                  Surah {result.surah_name} • Ayah {result.matched_ayah_start}-{result.matched_ayah_end}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-body font-bold text-accent">{result.score}</p>
                <p className="text-xs text-muted-foreground font-body">/ 100 score</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${result.score}%` }} />
              </div>
              <p className="text-xs text-muted-foreground font-body mt-1">Confidence: {result.confidence}%</p>
            </div>

            <h3 className="text-sm font-display font-bold text-foreground mb-3">Word-by-Word Breakdown</h3>
            <div className="flex flex-wrap gap-2" dir="rtl">
              {result.breakdown.words.map((w: any, i: number) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 rounded-lg text-lg font-display ${
                    w.status === "correct"
                      ? "bg-primary/10 text-primary"
                      : w.status === "missed"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  {w.word}
                </span>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs font-body text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/20" /> Correct</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive/20" /> Missed</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent/20" /> Extra</span>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Recent Attempts</h2>
          {history.length === 0 ? (
            <p className="text-muted-foreground font-body">No previous attempts found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {history.map((h) => (
                <div key={h.id} className="bg-card rounded-xl p-4 border border-border shadow-soft flex items-center justify-between cursor-pointer hover:border-accent transition-colors" onClick={() => setResult(h)}>
                  <div>
                    <p className="font-display font-bold text-foreground">Surah {h.matched_surah}</p>
                    <p className="text-xs text-muted-foreground font-body">Ayah {h.matched_ayah_start}-{h.matched_ayah_end}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-body font-bold text-accent">{h.score}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{new Date(h.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecitationChecker;
