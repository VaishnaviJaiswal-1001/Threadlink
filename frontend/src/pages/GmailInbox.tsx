import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Loader2, RefreshCw, Search, CheckCircle2, CircleDot } from "lucide-react";
import { format } from "date-fns";
import { EmailViewerModal } from "@/components/features/EmailViewerModal";

interface EmailMessage {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  read: boolean;
  labels: string[];
}

const GmailInbox = () => {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["gmail-inbox"],
    queryFn: async () => {
      const res = await api.get("/email/inbox");
      return res.data.data;
    },
  });

  const messages: EmailMessage[] = data?.messages || [];

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.read;
    if (filter === "read") return msg.read;
    return true;
  });

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1200px] mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#E8381A]/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-[#E8381A]" />
            </div>
            Gmail Inbox
          </h1>
          <p className="text-text-secondary text-[14px] mt-1">Manage and view your connected Gmail messages.</p>
        </div>
        
        <button 
          onClick={() => refetch()} 
          disabled={isRefetching}
          className="h-10 px-4 rounded-md border border-border bg-card flex items-center gap-2 hover:bg-surface transition-all text-[14px] font-medium shadow-card-sm"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl shadow-card-sm flex-1 overflow-hidden flex flex-col min-h-[500px]">
        {/* Search & Tabs */}
        <div className="border-b border-border bg-surface/30">
          <div className="p-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input 
                placeholder="Search in mail..." 
                className="w-full pl-9 pr-4 h-9 rounded-md border border-border bg-background text-[13px] focus:outline-none focus:ring-1 focus:ring-brand-blue/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex px-4 gap-6">
            <button 
              onClick={() => setFilter("all")} 
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors flex items-center gap-2 ${filter === 'all' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-text-secondary hover:text-foreground'}`}
            >
              All Emails
            </button>
            <button 
              onClick={() => setFilter("unread")} 
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors flex items-center gap-2 ${filter === 'unread' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-text-secondary hover:text-foreground'}`}
            >
              <CircleDot className="h-3.5 w-3.5" />
              Unread
            </button>
            <button 
              onClick={() => setFilter("read")} 
              className={`pb-3 text-[14px] font-medium border-b-2 transition-colors flex items-center gap-2 ${filter === 'read' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-text-secondary hover:text-foreground'}`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Read
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-text-muted gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
              <p className="text-[14px]">Fetching emails from Google...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-text-muted gap-2">
              <div className="h-12 w-12 rounded-full bg-brand-red/10 flex items-center justify-center mb-2">
                <Mail className="h-6 w-6 text-brand-red" />
              </div>
              <p className="text-[15px] text-brand-red font-medium">Failed to load inbox</p>
              <p className="text-[13px]">Make sure your Gmail account is still connected and authorized.</p>
              <button onClick={() => refetch()} className="mt-4 text-[13px] font-medium text-brand-blue hover:underline">Try Again</button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-text-muted gap-2">
              <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center mb-2">
                <Mail className="h-6 w-6 opacity-40" />
              </div>
              <p className="text-[14px] font-medium">Your inbox is empty</p>
              <p className="text-[13px]">You're all caught up!</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-text-muted gap-2">
              <p className="text-[14px] font-medium">No emails found</p>
              <p className="text-[13px]">Try changing your classification filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredMessages.map((msg, i) => {
                const isUnread = !msg.read;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    key={msg.id} 
                    onClick={() => setSelectedEmailId(msg.id)}
                    className={`p-4 sm:px-6 flex flex-col gap-1 hover:bg-surface cursor-pointer transition-colors ${isUnread ? 'bg-brand-blue/5' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-1 gap-4">
                      <span className={`text-[14px] truncate ${isUnread ? 'font-semibold text-foreground' : 'font-medium text-text-secondary'}`}>
                        {msg.from.split('<')[0].trim()}
                      </span>
                      <span className={`text-[12px] shrink-0 ${isUnread ? 'font-medium text-brand-blue' : 'text-text-muted'}`}>
                        {msg.date ? format(new Date(msg.date), 'MMM d, h:mm a') : ''}
                      </span>
                    </div>
                    <div className={`text-[14px] truncate mb-0.5 ${isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>
                      {msg.subject || "(No Subject)"}
                    </div>
                    <div className="text-[13px] text-text-muted line-clamp-1">
                      {msg.snippet}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Email Viewer Modal */}
      {selectedEmailId && (
        <EmailViewerModal 
          emailId={selectedEmailId} 
          onClose={() => setSelectedEmailId(null)} 
        />
      )}
    </div>
  );
};

export default GmailInbox;
