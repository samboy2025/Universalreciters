import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Activate from "./pages/Activate";
import RecitationChecker from "./pages/RecitationChecker";
import UploadContent from "./pages/UploadContent";
import Explore from "./pages/Explore";
import ContentDetail from "./pages/ContentDetail";
import UserProfile from "./pages/UserProfile";
import AdminPanel from "./pages/AdminPanel";
import TransactionHistory from "./pages/TransactionHistory";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/wallet" element={<Wallet />} />
            <Route path="/dashboard/history" element={<TransactionHistory />} />
            <Route path="/activate" element={<Activate />} />
            <Route path="/recitation-checker" element={<RecitationChecker />} />
            <Route path="/upload" element={<UploadContent />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route path="/u/:username" element={<UserProfile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
