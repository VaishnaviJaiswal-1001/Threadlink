import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Sparkles, Loader2, Search } from "lucide-react";
import { TaskCard } from "@/components/ui/TaskCard";
import { GradientButton, GhostButton } from "@/components/ui/GradientButton";
import { AISuggestionsPanel } from "@/components/features/AISuggestionsPanel";
import { MiniCalendar } from "@/components/features/MiniCalendar";
import { MOCK_TASKS } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { EmailViewerModal } from "@/components/features/EmailViewerModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [thinking, setThinking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const generate = () => {
    setThinking(true);
    setTimeout(() => setThinking(false), 1800);
  };

  const { data: inboxData, isLoading: isEmailsLoading } = useQuery({
    queryKey: ["gmail-inbox"],
    queryFn: async () => {
      const res = await api.get("/email/inbox");
      return res.data.data;
    },
    enabled: !!submittedKeyword,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedKeyword(keywordInput.trim());
    setIsModalOpen(false);
  };

  const emails = inboxData?.messages || [];
  const filteredEmails = submittedKeyword 
    ? emails.filter((msg: any) => 
        msg.subject?.toLowerCase().includes(submittedKeyword.toLowerCase()) || 
        msg.snippet?.toLowerCase().includes(submittedKeyword.toLowerCase())
      )
    : [];

  const emailTasks = filteredEmails.map((msg: any) => ({
    id: msg.id,
    title: msg.subject || "(No Subject)",
    description: msg.snippet,
    priority: !msg.read ? "high" : "low",
    status: "todo",
  }));

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
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <GhostButton className="h-9 px-3"><Plus className="h-4 w-4" /> Add task</GhostButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Search Emails as Tasks</DialogTitle>
                  <DialogDescription>
                    Enter keywords to find relevant emails and bring them into your task list.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSearch} className="space-y-4 pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input 
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="e.g., invoice, meeting, urgent" 
                      className="w-full pl-9 pr-4 h-11 rounded-md border border-border bg-background text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40 transition-all"
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <button type="button" className="h-10 px-4 rounded-md text-[14px] font-medium text-text-secondary hover:bg-surface">Cancel</button>
                    </DialogClose>
                    <GradientButton type="submit">Search Emails</GradientButton>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            className="space-y-3"
          >
            {submittedKeyword && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-semibold text-brand-blue flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Results for "{submittedKeyword}"
                  </h3>
                  {isEmailsLoading && <Loader2 className="h-4 w-4 animate-spin text-text-muted" />}
                </div>
                
                {!isEmailsLoading && emailTasks.length === 0 ? (
                  <div className="p-6 border border-border border-dashed rounded-xl flex flex-col items-center justify-center text-center">
                    <p className="text-[14px] text-text-secondary font-medium">No matching emails found.</p>
                    <p className="text-[13px] text-text-muted mt-1">Try a different keyword.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emailTasks.map((t: any) => (
                      <motion.div key={t.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                        <TaskCard task={t as any} onClick={() => setSelectedEmailId(t.id)} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

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

      {/* Email Viewer Modal for Tasks */}
      {selectedEmailId && (
        <EmailViewerModal 
          emailId={selectedEmailId} 
          onClose={() => setSelectedEmailId(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;