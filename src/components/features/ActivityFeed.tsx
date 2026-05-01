import { AnimatePresence, motion } from "framer-motion";
import { MOCK_ACTIVITY } from "@/lib/mockData";

export const ActivityFeed = () => (
  <div className="bg-card border border-border rounded-xl p-5 shadow-card-sm">
    <h3 className="text-[15px] font-semibold mb-4">Recent activity</h3>
    <ul className="space-y-3">
      <AnimatePresence>
        {MOCK_ACTIVITY.map((e, i) => (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-3"
          >
            <span
              className="mt-1 h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: e.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] leading-snug">{e.message}</div>
              <div className="text-[11px] text-text-muted">{e.source} · {e.time}</div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  </div>
);