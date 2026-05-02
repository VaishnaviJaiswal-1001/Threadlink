import { Calendar, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Task } from "@/lib/mockData";
import { PriorityBadge, SourcePill } from "./PriorityBadges";

export interface ExtendedTask extends Task {
  isAlreadyAdded?: boolean;
}

export const TaskCard = ({ task, onClick, onToggle }: { task: ExtendedTask; onClick?: () => void; onToggle?: (done: boolean) => void }) => {
  const [done, setDone] = useState(!!task.done);
  const [flash, setFlash] = useState(false);

  const toggle = () => {
    const newDone = !done;
    if (newDone) {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        if (onToggle) onToggle(newDone);
      }, 700); // Wait for flash animation before triggering the callback
    } else {
      if (onToggle) onToggle(newDone);
    }
    setDone(newDone);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "group bg-card border border-border rounded-xl p-4 shadow-card-sm hover:shadow-card-md flex items-start gap-3",
        onClick && "cursor-pointer",
        flash && "animate-green-flash",
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        aria-label="Toggle task"
        className={cn(
          "mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-all",
          done ? "bg-brand-green border-brand-green text-white" : "border-border hover:border-foreground",
        )}
      >
        {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={cn("text-[15px] font-medium leading-snug", done && "line-through text-text-muted")}>
          {task.title}
        </div>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <span className="inline-flex items-center gap-1 text-[12px] text-text-secondary">
            <Calendar className="h-3.5 w-3.5" />
            {task.deadline}
          </span>
          <SourcePill source={task.source} />
          {task.isAlreadyAdded && (
            <span className="ml-auto text-[11px] font-medium bg-surface text-text-secondary px-2 py-0.5 rounded-full border border-border">
              Already Added
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};