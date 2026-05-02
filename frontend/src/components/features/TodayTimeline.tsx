import { motion } from "framer-motion";
import { MOCK_TASKS } from "@/lib/mockData";
import { TaskCard } from "@/components/ui/TaskCard";

export const TodayTimeline = () => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const dayPct = Math.min(100, Math.max(0, ((minutes - 8 * 60) / (12 * 60)) * 100));

  return (
    <div className="relative pl-20">
      {/* gradient timeline */}
      <div className="absolute left-14 top-2 bottom-2 w-[3px] rounded-full"
        style={{ background: "linear-gradient(to bottom, #E8381A, #F5861A, #F5C800, #2BB74A, #1A6CF5)" }}
      />
      <div
        className="absolute left-[52px] h-3 w-3 rounded-full bg-gradient-brand ai-pulse ring-4 ring-background"
        style={{ top: `calc(${dayPct}% + 4px)` }}
      />
      <div className="space-y-5">
        {MOCK_TASKS.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            <span className="absolute -left-[60px] top-3 text-[12px] font-medium text-text-secondary w-12 text-right">{t.time}</span>
            <TaskCard task={t} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};