import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/threadlink-logo.png";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { GradientButton } from "@/components/ui/GradientButton";
import { AppCard } from "@/components/ui/AppCard";
import { APPS } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [connected, setConnected] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [shaking, setShaking] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, checkAuth } = useAuth();

  const finishOnboarding = async () => {
    try {
      await api.post("/onboarding/complete");
      await checkAuth(); // update user state
      navigate("/dashboard");
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to complete onboarding." });
    }
  };

  useEffect(() => {
    // Fetch initial status
    const fetchStatus = async () => {
      try {
        const res = await api.get("/onboarding/status");
        if (res.data.success) {
          const { step, selectedApps, connectedApps, phone, onboardingCompleted } = res.data.data;
          
          if (onboardingCompleted || step === 4) {
            finishOnboarding();
            return;
          }
          
          setStep(step);
          setSelected(selectedApps || []);
          setConnected(connectedApps || []);
          if (phone) {
            setPhone(phone.startsWith('+91') ? phone.substring(3).trim() : phone);
          }
        }
      } catch (err) {
        console.error("Failed to fetch onboarding status", err);
      }
    };
    fetchStatus();
  }, []);

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const saveAppsAndContinue = async () => {
    if (!selected.length) return;
    try {
      await api.post("/onboarding/apps/select", { apps: selected });
      setStep(2);
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save selected apps." });
    }
  };

  const tryConnect = async (id: string) => {
    if (connected.includes(id)) return;
    
    try {
      const res = await api.post("/onboarding/apps/connect", { appId: id });
      if (res.data.success) {
        if (res.data.data.url) {
          // Redirect to Google OAuth for Gmail
          window.location.href = res.data.data.url;
        } else {
          // Stub connection successful
          setConnected((c) => [...c, id]);
          toast({ title: "Connected", description: "App successfully connected." });
        }
      }
    } catch (err) {
      setShaking(id);
      toast({ title: "Couldn't connect", description: "Please try again.", variant: "destructive" });
      setTimeout(() => setShaking(null), 500);
    }
  };

  const handleAppsConnectedContinue = () => {
    setStep(3);
  };

  const savePhoneAndContinue = async () => {
    if (!phone || phone.length < 10) {
      toast({ variant: "destructive", title: "Invalid Phone", description: "Please enter a valid 10-digit phone number." });
      return;
    }
    try {
      const fullPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;
      await api.post("/onboarding/phone", { phone: fullPhone });
      finishOnboarding();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save phone number." });
    }
  };

  const visibleApps = step === 2 ? APPS.filter((a) => selected.includes(a.id)) : APPS;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-10"><StepIndicator current={step} /></div>
        <div className="bg-card border border-border rounded-2xl shadow-card-md p-10">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="text-center">
                <motion.img
                  src={logo}
                  alt="Threadlink"
                  className="h-32 mx-auto mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <h1 className="text-[32px] font-semibold tracking-tight">
                  Hey {user?.name?.split(' ')[0] || 'there'}, welcome to Threadlink 👋
                </h1>
                <p className="mt-2 text-text-secondary text-[16px]">Let's get you set up in 2 minutes.</p>
                <div className="mt-8 flex justify-center">
                  <GradientButton size="lg" onClick={() => setStep(1)}>Let's go <ArrowRight className="h-4 w-4" /></GradientButton>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <h2 className="text-[24px] font-semibold text-center">Which apps do you use daily?</h2>
                <p className="text-center text-text-secondary text-[14px] mt-1">Select all that apply.</p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {APPS.map((a) => (
                    <AppCard
                      key={a.id}
                      name={a.name}
                      color={a.color}
                      tint={a.tint}
                      Icon={a.icon}
                      selected={selected.includes(a.id)}
                      onClick={() => toggleSelect(a.id)}
                    />
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <GradientButton onClick={saveAppsAndContinue}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <h2 className="text-[24px] font-semibold text-center">Connect your apps to Threadlink</h2>
                <p className="text-center text-text-secondary text-[14px] mt-1">One click — we handle the rest.</p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visibleApps.map((a) => (
                    <AppCard
                      key={a.id}
                      name={a.name}
                      color={a.color}
                      tint={a.tint}
                      Icon={a.icon}
                      connected={connected.includes(a.id)}
                      shake={shaking === a.id}
                      rightSlot={
                        <button
                          onClick={(e) => { e.stopPropagation(); tryConnect(a.id); }}
                          className="h-8 px-3 rounded-md bg-gradient-brand text-white text-[12px] font-semibold"
                        >Connect</button>
                      }
                    />
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <GradientButton onClick={handleAppsConnectedContinue}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <h2 className="text-[24px] font-semibold text-center">Enable WhatsApp Reminders</h2>
                <p className="text-center text-text-secondary text-[14px] mt-1">Get instantly notified about important actionable emails.</p>
                <div className="mt-8 flex flex-col items-center">
                  <div className="w-full max-w-sm">
                    <label className="block text-[13px] font-medium text-text-secondary mb-2">WhatsApp Phone Number</label>
                    <div className="flex items-center relative">
                      <span className="absolute left-4 text-[14px] text-text-secondary font-medium">+91</span>
                      <input 
                        type="text" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                        placeholder="10-digit number" 
                        maxLength={10}
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-background focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                      />
                    </div>
                    <p className="text-[12px] text-text-muted mt-2 text-center">
                      Used only to send you important tasks. Standard messaging rates apply.
                    </p>
                  </div>
                </div>
                <div className="mt-10 flex justify-between items-center">
                  <button onClick={finishOnboarding} className="text-[14px] text-text-secondary hover:text-foreground font-medium transition-colors">
                    Skip for now
                  </button>
                  <GradientButton onClick={savePhoneAndContinue}>
                    Finish setup <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;