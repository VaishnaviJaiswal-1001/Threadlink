import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Plug, Zap, Brain } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GradientButton, GhostButton } from "@/components/ui/GradientButton";
import { GradientText } from "@/components/ui/GradientText";
import { FlowVisual } from "@/components/features/FlowVisual";

const features = [
  { Icon: Plug, title: "Connect once, sync forever", desc: "One-click integrations with Gmail and Calendar — kept fresh in real-time.", color: "linear-gradient(135deg,#1A6CF5,#2BB74A)" },
  { Icon: Zap, title: "If this, then that — no code", desc: "Build automations in natural language. Threadlink turns intent into reliable workflows.", color: "linear-gradient(135deg,#2BB74A,#F5C800)" },
  { Icon: Brain, title: "AI that knows your priorities", desc: "Context-aware suggestions, urgent-task detection, and smart day planning.", color: "linear-gradient(135deg,#E8381A,#F5861A)" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(26,108,245,0.08),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-[12px] text-text-secondary mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              New: AI day planner is live
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-[40px] sm:text-display max-w-3xl mx-auto leading-[1.05] font-bold tracking-tight"
            >
              Stop switching apps. Let <GradientText>AI</GradientText> run your workflow.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 text-[18px] text-text-secondary max-w-xl mx-auto leading-relaxed"
            >
              Threadlink connects Gmail and Calendar — then automates the gaps so you can focus on what actually matters.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex items-center justify-center gap-3 flex-wrap"
            >
              <Link to="/signup">
                <GradientButton size="lg">Get Started Free <ArrowRight className="h-4 w-4" /></GradientButton>
              </Link>
              <GhostButton><Play className="h-4 w-4" /> Watch demo</GhostButton>
            </motion.div>

            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <div className="flex -space-x-2">
                {["#E8381A","#F5861A","#F5C800","#2BB74A","#1A6CF5"].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-background" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="text-[13px] text-text-secondary">
                Trusted by <span className="font-semibold text-foreground">2,400+ teams</span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                ))}
                <span className="ml-1 text-[13px] text-text-secondary">4.9 / 5</span>
              </div>
            </div>
          </div>
        </section>

        {/* Flow */}
        <section id="flow" className="max-w-6xl mx-auto px-6 pb-20">
          <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 shadow-card-sm">
            <FlowVisual />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-6 pb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-[32px] font-semibold tracking-tight">Everything you need to focus on real work</h2>
            <p className="mt-3 text-text-secondary">Three pillars that turn scattered tools into one calm flow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map(({ Icon, title, desc, color }) => (
              <motion.div
                key={title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-surface border border-border rounded-xl p-6 shadow-card-sm overflow-hidden"
              >
                <span className="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-brand" />
                <div className="h-11 w-11 rounded-lg flex items-center justify-center text-white mb-4" style={{ background: color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[17px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[14px] text-text-secondary leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-2xl p-10 text-center bg-gradient-brand text-white shadow-card-md">
            <h3 className="text-[28px] font-semibold">Connect. Automate. Focus. Achieve.</h3>
            <p className="mt-2 text-white/85">Start free — no credit card required.</p>
            <div className="mt-6 flex justify-center">
              <Link to="/signup">
                <button className="h-12 px-7 rounded-xl bg-white text-foreground font-semibold hover:bg-white/90 transition-colors">
                  Get Started Free →
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
