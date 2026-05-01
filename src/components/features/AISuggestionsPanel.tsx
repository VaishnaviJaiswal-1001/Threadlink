import { Sparkles, RefreshCw } from "lucide-react";
import { GhostButton } from "@/components/ui/GradientButton";
import { MOCK_SUGGESTIONS } from "@/lib/mockData";
import { motion } from "framer-motion";

export const AISuggestionsPanel = () => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-card-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-orange" />
        <h3 className="text-[15px] font-semibold">
          <span className="text-gradient-brand">✦</span> AI Suggestions
        </h3>
      </div>
      <button className="text-text-muted hover:text-foreground" aria-label="Refresh">
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
    <ul className="space-y-3">
      {MOCK_SUGGESTIONS.map((s, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="relative pl-3 pr-2 py-2 rounded-md bg-surface"
        >
          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gradient-brand" />
          <p className="text-[13px] leading-relaxed pr-2">{s}</p>
          <div className="mt-1.5">
            <GhostButton className="h-7 px-2 text-[12px]">Do it →</GhostButton>
          </div>
        </motion.li>
      ))}
    </ul>
  </div>
);