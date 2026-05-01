import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const StepIndicator = ({ current, total = 3 }: { current: number; total?: number }) => (
  <div className="flex items-center justify-center gap-3">
    {Array.from({ length: total }).map((_, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={i} className="flex items-center gap-3">
          <div
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
              done && "bg-brand-green text-white",
              active && "bg-gradient-brand text-white shadow-card-md",
              !done && !active && "bg-elevated text-text-muted",
            )}
          >
            {done ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={cn("h-0.5 w-12 rounded-full", done ? "bg-brand-green" : "bg-border")} />
          )}
        </div>
      );
    })}
  </div>
);