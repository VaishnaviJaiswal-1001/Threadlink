import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, X } from "lucide-react";
import { useState } from "react";
import { GradientButton, GhostButton } from "@/components/ui/GradientButton";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SOURCES = ["Gmail", "Slack", "Calendar", "Drive"];
const CONDITIONS = ["contains keyword", "new message", "mentioned", "shared with me"];
const ACTIONS = ["Create task", "Notify", "Schedule", "Summarize"];

export const WorkflowBuilder = ({ open, onClose }: Props) => {
  const [name, setName] = useState("Untitled workflow");
  const [showConfig, setShowConfig] = useState(false);

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
                  <select className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]">
                    {SOURCES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <select className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]">
                    {CONDITIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input placeholder="Value (e.g. urgent)" className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]" />
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowDown className="h-6 w-6 text-brand-orange" />
              </div>

              <div className="rounded-xl border border-border p-4 bg-card shadow-card-sm">
                <div className="text-gradient-brand text-[12px] font-bold tracking-widest mb-3">THEN</div>
                <div className="space-y-2">
                  <select onChange={() => setShowConfig(true)} className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]">
                    {ACTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input placeholder="Target (e.g. #channel, list)" className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]" />
                  <AnimatePresence>
                    {showConfig && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 space-y-2">
                          <input placeholder="Note / template" className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]" />
                          <select className="w-full h-10 px-3 rounded-md border border-border bg-background text-[14px]">
                            <option>Priority: Normal</option>
                            <option>Priority: High</option>
                            <option>Priority: Urgent</option>
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border space-y-2">
              <GradientButton fullWidth onClick={onClose}>Save workflow</GradientButton>
              <GhostButton className="w-full">Test this workflow</GhostButton>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};