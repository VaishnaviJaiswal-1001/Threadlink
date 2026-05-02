import { AnimatePresence, motion } from "framer-motion";
import { Send, X, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Msg { role: "bot" | "user"; text: string }
const SUGGESTIONS = ["What should I do next?", "Plan my day", "Create a task", "Any urgent items?"];
const INITIAL: Msg[] = [
  { role: "bot", text: "Hi! I'm Threadlink AI. How can I help you focus today?" },
];

export const ChatbotPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    try {
      const { api } = await import('@/lib/api');
      const res = await api.post('/ai/chat', { message: text });
      setMessages((m) => [...m, { role: "bot", text: res.data.data.reply }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: "bot", text: "Sorry, I ran into an error processing that." }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          className="fixed bottom-24 right-6 z-40 w-[360px] h-[520px] bg-card border border-border rounded-2xl shadow-card-xl flex flex-col overflow-hidden"
        >
          <div className="h-14 px-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-brand flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[13px] font-semibold leading-tight">Threadlink AI</div>
                <div className="text-[11px] text-text-muted">Always here to help</div>
              </div>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed",
                  m.role === "user" ? "bg-gradient-brand text-white rounded-br-md" : "bg-surface text-foreground rounded-bl-md",
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex">
                <div className="bg-surface px-3 py-2.5 rounded-2xl rounded-bl-md flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted ai-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted ai-pulse" style={{ animationDelay: "0.2s" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted ai-pulse" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            )}

            {messages.length === 1 && !thinking && (
              <div className="pt-2">
                <div className="text-[11px] text-text-muted mb-2">Try asking</div>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="shrink-0 text-[12px] px-3 py-1.5 rounded-full border border-border bg-background hover:bg-surface whitespace-nowrap"
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-3 border-t border-border flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Threadlink AI…"
              className="flex-1 h-10 px-4 rounded-full bg-surface border border-border text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
            <button type="submit" className="h-10 w-10 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-card-sm">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};