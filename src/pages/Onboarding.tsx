import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/threadlink-logo.png";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { GradientButton } from "@/components/ui/GradientButton";
import { AppCard } from "@/components/ui/AppCard";
import { APPS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [connected, setConnected] = useState<string[]>([]);
  const [shaking, setShaking] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleSelect = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const tryConnect = (id: string) => {
    if (connected.includes(id)) return;
    // Demo: Drive randomly fails
    if (id === "gdrive" && Math.random() < 0.5) {
      setShaking(id);
      toast({ title: "Couldn't connect Google Drive", description: "Please try again.", variant: "destructive" });
      setTimeout(() => setShaking(null), 500);
      return;
    }
    setConnected((c) => [...c, id]);
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
                  className="h-14 mx-auto mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <h1 className="text-[32px] font-semibold tracking-tight">
                  Hey Alex, welcome to Threadlink 👋
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
                  <GradientButton onClick={() => selected.length && setStep(2)}>
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
                  <GradientButton onClick={() => navigate("/dashboard")}>
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