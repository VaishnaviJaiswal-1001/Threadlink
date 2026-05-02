import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Sparkles, Loader2, Search, RefreshCw, X } from "lucide-react";
import { TaskCard } from "@/components/ui/TaskCard";
import { GradientButton, GhostButton } from "@/components/ui/GradientButton";
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
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [isManualTaskModalOpen, setIsManualTaskModalOpen] = useState(false);
  const [manualTaskTitle, setManualTaskTitle] = useState("");
  const [manualTaskPriority, setManualTaskPriority] = useState("Normal");

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  
  const hour = new Date().getHours();
  let greeting = "Good night";
  if (hour >= 5 && hour < 12) greeting = "Good morning";
  else if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17 && hour < 22) greeting = "Good evening";

  const generate = () => {
    setThinking(true);
    setTimeout(() => setThinking(false), 1800);
  };

  const { data: inboxData, isLoading: isEmailsLoading } = useQuery({
    queryKey: ["gmail-inbox", submittedKeyword],
    queryFn: async () => {
      const res = await api.get(`/email/inbox?q=${encodeURIComponent(submittedKeyword)}`);
      return res.data.data;
    },
    enabled: !!submittedKeyword,
  });

  const { data: tasksData, refetch: refetchTasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data.data;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedKeyword(keywordInput.trim());
    setIsModalOpen(false);
  };

  const handleToggleTask = async (taskId: string, done: boolean) => {
    if (done) {
      try {
        await api.delete(`/tasks/${taskId}`);
        refetchTasks();
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    }
  };

  const handleSyncMailbot = async () => {
    setIsSyncing(true);
    try {
      await api.post("/email/sync");
      // Could add a toast notification here
    } catch (err) {
      console.error("Mailbot sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddManualTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTaskTitle.trim()) return;
    try {
      await api.post("/tasks", {
        title: manualTaskTitle,
        priority: manualTaskPriority,
        source: "Manual"
      });
      setManualTaskTitle("");
      setManualTaskPriority("Normal");
      setIsManualTaskModalOpen(false);
      refetchTasks();
    } catch (err) {
      console.error("Failed to add manual task", err);
    }
  };

  const emails = inboxData?.messages || [];
  
  // The backend already filters via Gmail API using the 'q' parameter, 
  // so we don't need to filter by subject/snippet on the frontend.
  const searchResults = submittedKeyword ? emails : [];

  // Determine which emails are already tasks
  const existingTaskExternalIds = new Set((tasksData || []).map((t: any) => t.externalId).filter(Boolean));

  const emailTasks = searchResults.map((msg: any) => ({
    id: msg.id,
    title: msg.subject || "(No Subject)",
    description: msg.snippet,
    priority: !msg.read ? "high" : "low",
    status: "todo",
    isAlreadyAdded: existingTaskExternalIds.has(msg.id)
  }));

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1400px] mx-auto">
      {/* Topbar */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight">{greeting}, {user?.name?.split(' ')[0] || 'User'}</h1>
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
          <><Sparkles className="h-4 w-4" /> Plan your day</>
        )}
      </motion.button>

      {/* Two-col */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Left: tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold">Tasks</h2>
            <div className="flex gap-2">
              <GhostButton onClick={handleSyncMailbot} disabled={isSyncing} className="h-9 px-3">
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /> Sync Mailbot
              </GhostButton>
              <Dialog open={isManualTaskModalOpen} onOpenChange={setIsManualTaskModalOpen}>
                <DialogTrigger asChild>
                  <GhostButton className="h-9 px-3"><Plus className="h-4 w-4" /> Add task</GhostButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Manual Task</DialogTitle>
                    <DialogDescription>
                      Create a custom task and assign it a priority.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddManualTask} className="space-y-4 pt-4">
                    <div>
                      <input 
                        value={manualTaskTitle}
                        onChange={(e) => setManualTaskTitle(e.target.value)}
                        placeholder="Task title..." 
                        className="w-full px-4 h-11 rounded-md border border-border bg-background text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40 transition-all"
                        autoFocus
                      />
                    </div>
                    <div>
                      <select 
                        value={manualTaskPriority}
                        onChange={(e) => setManualTaskPriority(e.target.value)}
                        className="w-full px-4 h-11 rounded-md border border-border bg-background text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40 transition-all"
                      >
                        <option value="Low">Low</option>
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button type="button" className="h-10 px-4 rounded-md text-[14px] font-medium text-text-secondary hover:bg-surface">Cancel</button>
                      </DialogClose>
                      <GradientButton type="submit">Save Task</GradientButton>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <GhostButton className="h-9 px-3"><Search className="h-4 w-4" /> Search Emails</GhostButton>
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
                  <div className="flex items-center gap-3">
                    {isEmailsLoading && <Loader2 className="h-4 w-4 animate-spin text-text-muted" />}
                    <button 
                      onClick={() => {
                        setSubmittedKeyword("");
                        setKeywordInput("");
                      }}
                      className="text-[13px] text-text-secondary hover:text-foreground font-medium flex items-center gap-1 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> Clear search
                    </button>
                  </div>
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

            {tasksData && tasksData.length > 0 ? (
              (tasksData as any[]).map((t) => (
                <motion.div key={t._id || t.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                  <TaskCard 
                    task={{...t, id: t._id || t.id}} 
                    onClick={t.externalId ? () => setSelectedEmailId(t.externalId) : undefined} 
                    onToggle={(done) => handleToggleTask(t._id || t.id, done)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="p-8 border border-border border-dashed rounded-xl flex flex-col items-center justify-center text-center">
                <p className="text-[14px] text-text-secondary font-medium">No tasks yet.</p>
                <p className="text-[13px] text-text-muted mt-1">Search your emails or use AI to generate tasks.</p>
              </div>
            )}
          </motion.div>
        </section>

        {/* Right: AI + calendar */}
        <aside className="space-y-5">
          <MiniCalendar />
        </aside>
      </div>

      {/* Email Viewer Modal for Tasks */}
      {selectedEmailId && (
        <EmailViewerModal 
          emailId={selectedEmailId} 
          onClose={() => setSelectedEmailId(null)}
          onTaskAdded={() => {
            refetchTasks();
            setSelectedEmailId(null);
          }}
          isAlreadyTask={existingTaskExternalIds.has(selectedEmailId)}
        />
      )}
    </div>
  );
};

export default Dashboard;