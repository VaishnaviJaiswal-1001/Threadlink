import { useState } from "react";
import { Plus, Pencil, Loader2, Trash2 } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { WorkflowBuilder } from "@/components/features/WorkflowBuilder";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const Workflows = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      const res = await api.get("/workflows");
      return res.data.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => await api.patch(`/workflows/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workflows"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await api.delete(`/workflows/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workflows"] }),
  });

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight">Workflows</h1>
          <p className="text-text-secondary text-[14px] mt-1">Automations across your connected apps.</p>
        </div>
        <GradientButton onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create workflow</GradientButton>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card-sm overflow-hidden">
        {isLoading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand-blue" /></div>
        ) : workflows.length === 0 ? (
          <div className="py-12 text-center text-text-secondary">No workflows created yet.</div>
        ) : workflows.map((w: any, i: number) => (
          <div
            key={w._id}
            className={cn(
              "grid grid-cols-[1fr_auto] sm:grid-cols-[1.4fr_1.4fr_1.4fr_auto_auto] items-center gap-4 px-5 py-4",
              i !== workflows.length - 1 && "border-b border-border",
            )}
          >
            <div className="font-medium text-[15px]">{w.name}</div>
            <div className="hidden sm:block text-[13px] text-text-secondary">IF · {w.trigger?.app} {w.trigger?.condition}</div>
            <div className="hidden sm:block text-[13px] text-text-secondary">THEN · {w.action?.type?.replace('_', ' ')}</div>
            <button
              role="switch"
              aria-checked={w.on}
              onClick={() => toggleMutation.mutate(w._id)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                w.on ? "bg-gradient-brand" : "bg-elevated",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card-sm transition-all",
                  w.on ? "left-[22px]" : "left-0.5",
                )}
              />
            </button>
            <button onClick={() => deleteMutation.mutate(w._id)} className="h-9 w-9 rounded-md hover:bg-elevated flex items-center justify-center text-text-secondary hover:text-red-500" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <WorkflowBuilder open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default Workflows;