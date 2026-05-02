import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Loader2, X, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

const decodeBase64Url = (base64Url: string) => {
  if (!base64Url) return "";
  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const binString = atob(base64);
    const bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      bytes[i] = binString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    console.error("Failed to decode email body", e);
    return "Error decoding email content.";
  }
};

const getEmailHtml = (payload: any): string => {
  let html = "";
  let text = "";

  const extract = (part: any) => {
    if (part.mimeType === "text/html" && part.body?.data) {
      html = decodeBase64Url(part.body.data);
    } else if (part.mimeType === "text/plain" && part.body?.data) {
      text = decodeBase64Url(part.body.data);
    } else if (part.parts) {
      part.parts.forEach(extract);
    }
  };

  if (payload) {
    if (payload.parts) {
      payload.parts.forEach(extract);
    } else if (payload.body?.data) {
      if (payload.mimeType === "text/html") {
        html = decodeBase64Url(payload.body.data);
      } else {
        text = decodeBase64Url(payload.body.data);
      }
    }
  }

  return html || (text ? `<pre style="font-family: sans-serif; white-space: pre-wrap;">${text}</pre>` : "No content available.");
};

export const EmailViewerModal = ({ emailId, onClose }: { emailId: string; onClose: () => void }) => {
  const { data: selectedEmailData, isLoading: isLoadingEmail } = useQuery({
    queryKey: ["gmail-message", emailId],
    queryFn: async () => {
      const res = await api.get(`/email/${emailId}`);
      return res.data.data;
    },
    enabled: !!emailId,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl h-[90vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-2 rounded-md hover:bg-background transition-colors text-text-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-[16px] font-semibold">Message</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-background transition-colors text-text-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-hidden flex flex-col bg-background">
          {isLoadingEmail ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
              <p className="text-[14px]">Loading message content...</p>
            </div>
          ) : selectedEmailData ? (
            <>
              <div className="p-6 border-b border-border">
                <h1 className="text-[22px] font-semibold text-foreground mb-4">
                  {selectedEmailData.payload?.headers?.find((h: any) => h.name === 'Subject')?.value || "(No Subject)"}
                </h1>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-semibold">
                      {(selectedEmailData.payload?.headers?.find((h: any) => h.name === 'From')?.value || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-foreground">
                        {selectedEmailData.payload?.headers?.find((h: any) => h.name === 'From')?.value || "Unknown Sender"}
                      </div>
                      <div className="text-[12px] text-text-muted">
                        to {selectedEmailData.payload?.headers?.find((h: any) => h.name === 'To')?.value || "me"}
                      </div>
                    </div>
                  </div>
                  <div className="text-[13px] text-text-muted whitespace-nowrap">
                    {selectedEmailData.internalDate ? format(new Date(parseInt(selectedEmailData.internalDate)), 'MMM d, yyyy, h:mm a') : ""}
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-white">
                <iframe 
                  title="Email Content"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                  className="w-full h-full border-none"
                  srcDoc={getEmailHtml(selectedEmailData.payload)}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <p>Failed to load email content.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
