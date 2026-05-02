import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { GradientButton, GhostButton } from "@/components/ui/GradientButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SOURCES = [
  { label: "Gmail", value: "gmail" },
  { label: "Calendar", value: "gcal" }
];

const ACTIONS = [
  { label: "Create task", value: "create_task" },
  { label: "Summarize", value: "summarize" },
  { label: "Notify", value: "notify" }
];

export const WorkflowBuilder = ({ open, onClose }: Props) => {
  const [name, setName] = useState("Untitled workflow");
  const [app, setApp] = useState("gmail");
  const [condition, setCondition] = useState("");
  const [actionType, setActionType] = useState("create_task");
  const [priority, setPriority] = useState("Normal");
  
  const [showConfig, setShowConfig] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name,
        trigger: { app, condition },
        action: { type: actionType, priority }
      };
      return await api.post("/workflows", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      toast({ title: "Workflow created", description: "Your new AI workflow is active." });
      onClose();
    },
    onError: (err: any) => {
      toast({ title: "Failed to create workflow", description: err.response?.data?.message || "Something went wrong", variant: "destructive" });
    }
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-background border-l border-border z-50 flex flex-col"
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <h3 className="text-[16px] font-semibold">New workflow</h3>
              <button onClick={onClose} className="text-text-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="text-[12px] font-medium text-text-secondary">Workflow name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-md border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                />
              </div>

              <div className="rounded-xl border border-border p-4 bg-card shadow-card-sm">
                <div className="text-gradient-brand text-[12px] font-bold tracking-widest mb-3">IF</div>
                <div className="space-y-2">
                  <select value={app} onChange={e => setApp(e.target.value)} className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]">
                    {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <input value={condition} onChange={e => setCondition(e.target.value)} placeholder="Condition (e.g. contains urgent, is from boss)" className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]" />
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-brand-orange" />
              </div>

              <div className="rounded-xl border border-border p-4 bg-card shadow-card-sm">
                <div className="text-gradient-brand text-[12px] font-bold tracking-widest mb-3">THEN</div>
                <div className="space-y-2">
                  <select value={actionType} onChange={e => { setActionType(e.target.value); setShowConfig(true); }} className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]">
                    {ACTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <AnimatePresence>
                    {showConfig && actionType === 'create_task' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 space-y-2">
                          <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]">
                            <option value="Normal">Priority: Normal</option>
                            <option value="High">Priority: High</option>
                            <option value="Urgent">Priority: Urgent</option>
                            <option value="Low">Priority: Low</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border space-y-2">
              <GradientButton fullWidth onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !condition}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save workflow
              </GradientButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};