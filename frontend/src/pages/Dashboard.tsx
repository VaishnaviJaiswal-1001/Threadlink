import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Sparkles } from "lucide-react";
import { TaskCard } from "@/components/ui/TaskCard";
import { GradientButton, GhostButton } from "@/components/ui/GradientButton";
import { AISuggestionsPanel } from "@/components/features/AISuggestionsPanel";
import { MiniCalendar } from "@/components/features/MiniCalendar";
import { MOCK_TASKS } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [thinking, setThinking] = useState(false);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const generate = () => {
    setThinking(true);
    setTimeout(() => setThinking(false), 1800);
  };

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1400px] mx-auto">
      {/* Topbar */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight">Good morning, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-text-secondary text-[14px] mt-1">{today}</p>
        </div>
        <button className="relative h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center hover:shadow-card-sm transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-red ring-2 ring-card" />
        </button>
      </div>

      {/* Generate */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.99 }}
        onClick={generate}
        className="w-full h-12 rounded-xl bg-gradient-brand text-white font-semibold shadow-card-md hover:shadow-card-xl transition-all flex items-center justify-center gap-2 mb-8"
      >
        {thinking ? (
          <>
            <span>AI is thinking</span>
            <span className="flex gap-1 ml-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white ai-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-white ai-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-white ai-pulse" style={{ animationDelay: "0.4s" }} />
            </span>
          </>
        ) : (
          <><Sparkles className="h-4 w-4" /> Generate my day</>
        )}
      </motion.button>

      {/* Two-col */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Left: tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold">Tasks</h2>
            <GhostButton className="h-9 px-3"><Plus className="h-4 w-4" /> Add task</GhostButton>
          </div>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            className="space-y-3"
          >
            {MOCK_TASKS.map((t) => (
              <motion.div key={t.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                <TaskCard task={t} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Right: AI + calendar */}
        <aside className="space-y-5">
          <AISuggestionsPanel />
          <MiniCalendar />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;