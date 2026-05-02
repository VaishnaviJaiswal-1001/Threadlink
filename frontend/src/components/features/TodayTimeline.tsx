import { motion } from "framer-motion";
import { TaskCard } from "@/components/ui/TaskCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const TodayTimeline = () => {
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks?done=false");
      return res.data.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      await api.put(`/tasks/${id}`, { done });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const dayPct = Math.min(100, Math.max(0, ((minutes - 8 * 60) / (12 * 60)) * 100));

  // Filter tasks for today's deadline or null deadlines
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t: any) => !t.deadline || t.deadline.startsWith(todayStr));

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand-blue" /></div>;
  }

  if (todayTasks.length === 0) {
    return <div className="text-center py-12 text-text-secondary">No tasks scheduled for today. You're all caught up!</div>;
  }

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
        {todayTasks.map((t: any, i: number) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            <span className="absolute -left-[60px] top-3 text-[12px] font-medium text-text-secondary w-12 text-right">
              {t.time || "Any time"}
            </span>
            <TaskCard 
              task={{ ...t, id: t._id, time: t.time || "Any time" }} 
              onToggle={(done) => toggleMutation.mutate({ id: t._id, done })}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};