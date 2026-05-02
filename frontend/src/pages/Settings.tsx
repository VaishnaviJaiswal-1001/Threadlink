import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { GradientButton } from "@/components/ui/GradientButton";
import { AppCard } from "@/components/ui/AppCard";
import { APPS } from "@/lib/constants";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { user, checkAuth } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(() => {
    if (user?.phone) {
      return user.phone.startsWith('+91') ? user.phone.substring(3).trim() : user.phone;
    }
    return "";
  });
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingApps, setIsFetchingApps] = useState(true);
  const [shaking, setShaking] = useState<string | null>(null);
  
  // Auto Reply State
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(user?.autoReplyEnabled !== false);
  
  // Resume specific state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(!!user?.resumeFileName);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get("/onboarding/status");
        if (res.data.success) {
          setConnectedApps(res.data.data.connectedApps || []);
          if (res.data.data.phone && !phone) {
            const p = res.data.data.phone;
            setPhone(p.startsWith('+91') ? p.substring(3).trim() : p);
          }
        }
      } catch (err) {
        console.error("Failed to fetch apps status", err);
      } finally {
        setIsFetchingApps(false);
      }
    };
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const fullPhone = phone ? (phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`) : "";
      await api.patch("/auth/profile", { name, email, phone: fullPhone, autoReplyEnabled });
      await checkAuth(); // refresh context
      toast({ title: "Profile updated", description: "Your settings have been saved successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update failed", description: err.response?.data?.message || "An error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setResumeFile(file);
    setIsUploadingResume(true);
    
    const formData = new FormData();
    formData.append("resume", file);
    
    try {
      const res = await api.post("/auth/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setResumeUploaded(true);
        toast({ title: "Resume Uploaded", description: "Your resume is now ready for auto-applications." });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload Failed", description: err.response?.data?.message || "Could not upload resume." });
    } finally {
      setIsUploadingResume(false);
    }
  };

  const tryConnect = async (id: string) => {
    // allow reconnects!
    try {
      const res = await api.post("/onboarding/apps/connect", { appId: id });
      if (res.data.success) {
        if (res.data.data.url) {
          window.location.href = res.data.data.url;
        } else {
          setConnectedApps((c) => [...c, id]);
          toast({ title: "Connected", description: "App successfully connected." });
        }
      }
    } catch (err) {
      setShaking(id);
      toast({ title: "Couldn't connect", description: "Please try again.", variant: "destructive" });
      setTimeout(() => setShaking(null), 500);
    }
  };

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[800px] mx-auto">
      <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight mb-2">Settings</h1>
      <p className="text-text-secondary text-[14px] mb-8">Manage your account, integrations, and preferences.</p>
      
      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card-sm">
          <h2 className="text-[18px] font-semibold mb-4">Profile Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:outline-none focus:border-brand-blue transition-colors text-[14px]"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled // Currently emails might be tied to Google auth, so best to disable or make informational
                className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-text-muted cursor-not-allowed focus:outline-none text-[14px]"
              />
            </div>
          </div>
        </div>

        {/* Phone Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card-sm">
          <h2 className="text-[18px] font-semibold mb-4">WhatsApp Notifications</h2>
          <div className="max-w-md">
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Phone Number (with Country Code)</label>
            <div className="flex items-center relative">
              <span className="absolute left-3 text-[14px] text-text-secondary font-medium">+91</span>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                placeholder="10-digit number" 
                maxLength={10}
                className="w-full h-10 pl-11 pr-3 rounded-lg border border-border bg-background focus:outline-none focus:border-brand-blue transition-colors text-[14px]"
              />
            </div>
            <p className="text-[12px] text-text-muted mt-2">
              Used strictly for sending you actionable WhatsApp reminders (like job applications).
            </p>
          </div>
        </div>

        {/* AI Auto-Reply Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card-sm flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold mb-1">AI Auto-Reply Agent</h2>
            <p className="text-[13px] text-text-secondary max-w-lg">
              When enabled, Threadlink will automatically generate and send intelligent, contextual email replies to new messages in your connected Gmail inbox.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={autoReplyEnabled}
              onChange={() => setAutoReplyEnabled(!autoReplyEnabled)}
            />
            <div className="w-11 h-6 bg-surface-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
          </label>
        </div>

        {/* Resume Upload Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-[18px] font-semibold mb-1">Resume / CV (Auto-Apply Agent)</h2>
              <p className="text-[13px] text-text-secondary max-w-lg mb-4">
                Upload your resume to let Threadlink automatically apply to jobs sent to your Gmail. 
                When we detect an application email, our agent will extract your info and attempt to apply on your behalf.
              </p>
            </div>
            {resumeUploaded && (
              <span className="text-[12px] font-medium text-brand-green px-2 py-1 bg-brand-green/10 rounded-md">Ready for Auto-Apply</span>
            )}
          </div>
          
          <div className="mt-2">
            <input 
              type="file" 
              id="resume-upload" 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
            />
            <label 
              htmlFor="resume-upload" 
              className={`inline-flex items-center justify-center h-10 px-4 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${
                resumeUploaded 
                  ? "bg-surface border border-border text-foreground hover:bg-surface-hover" 
                  : "bg-brand-blue text-white hover:bg-brand-blue/90"
              }`}
            >
              {isUploadingResume ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading...</>
              ) : resumeUploaded ? (
                "Update Resume"
              ) : (
                "Upload Resume"
              )}
            </label>
            {resumeFile && !isUploadingResume && (
              <span className="ml-3 text-[13px] text-text-secondary">{resumeFile.name}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <GradientButton onClick={handleSaveProfile} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </GradientButton>
        </div>

        <hr className="border-border my-8" />

        {/* Connected Apps Section */}
        <div>
          <h2 className="text-[18px] font-semibold mb-4">Connected Apps</h2>
          {isFetchingApps ? (
            <div className="flex items-center text-text-muted text-[14px]">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading apps...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {APPS.map((a) => (
                <AppCard
                  key={a.id}
                  name={a.name}
                  color={a.color}
                  tint={a.tint}
                  Icon={a.icon}
                  connected={connectedApps.includes(a.id)}
                  shake={shaking === a.id}
                  rightSlot={
                    connectedApps.includes(a.id) ? undefined : (
                      <button
                        onClick={() => tryConnect(a.id)}
                        className="h-8 px-3 rounded-md bg-gradient-brand text-white text-[12px] font-semibold shadow-sm hover:opacity-90 transition-opacity"
                      >Connect</button>
                    )
                  }
                  bottomSlot={
                    connectedApps.includes(a.id) ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); tryConnect(a.id); }}
                        className="text-[11px] font-medium text-text-secondary hover:text-brand-blue bg-surface hover:bg-surface-hover border border-border px-3 py-1 rounded-md transition-colors shadow-sm w-fit mt-1"
                      >
                        Reconnect
                      </button>
                    ) : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Settings;