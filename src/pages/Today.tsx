import { GradientButton } from "@/components/ui/GradientButton";
import { Sparkles } from "lucide-react";
import { TodayTimeline } from "@/components/features/TodayTimeline";

const Today = () => (
  <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1100px] mx-auto">
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight">Today</h1>
        <p className="text-text-secondary text-[14px] mt-1">Your AI-planned day, in one timeline.</p>
      </div>
      <GradientButton><Sparkles className="h-4 w-4" /> Regenerate my day</GradientButton>
    </div>
    <TodayTimeline />
  </div>
);

export default Today;