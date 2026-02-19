import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Mic, Upload, Wallet, Users, Shield } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: Mic,
    title: "Recitation Checker",
    description: "Record or upload your recitation and get verse-level accuracy scoring with word-by-word feedback.",
  },
  {
    icon: Upload,
    title: "Upload & Monetize",
    description: "Share your recitations, set unlocking fees, and earn from your beautiful Qur'an recitations.",
  },
  {
    icon: Wallet,
    title: "Wallet & Points",
    description: "Fund your wallet, buy/sell points, and unlock premium content from top reciters worldwide.",
  },
  {
    icon: BookOpen,
    title: "Full Qur'an Database",
    description: "Complete Qur'an text with surah and ayah indexing for accurate verse matching.",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description: "Invite friends and earn points when they activate premium. Grow together.",
  },
  {
    icon: Shield,
    title: "Premium Access",
    description: "One-time ₦1,000 activation unlocks all premium features including the recitation checker.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="absolute inset-0 geometric-pattern" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              Attanzil Universal
              <span className="block text-gradient-gold">Reciters</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 font-body">
              Perfect your Qur'an recitation with AI-powered scoring, share your voice with the world,
              and earn from your beautiful recitations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Get Started — It's Free
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline" size="xl" className="border-primary-foreground/30 !text-primary-foreground !bg-transparent hover:!bg-primary-foreground/10">
                  Explore Reciters
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background geometric-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto font-body">
              A complete platform for Qur'an recitation, content sharing, and community growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-card rounded-xl p-8 shadow-soft border border-border hover:shadow-elevated transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-hero relative">
        <div className="absolute inset-0 geometric-pattern opacity-30" />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
            Start Your Recitation Journey
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-10 font-body">
            Join thousands of reciters. Activate premium for just ₦1,000 and unlock the full experience.
          </p>
          <Link to="/auth?mode=signup">
            <Button variant="hero" size="xl">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display text-lg font-bold text-foreground mb-2">Attanzil Universal Reciters</p>
          <p className="text-sm text-muted-foreground font-body">
            © 2026 Attanzil. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
