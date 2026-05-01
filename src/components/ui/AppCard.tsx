import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AppCardProps {
  name: string;
  color: string;
  tint: string;
  Icon: LucideIcon;
  selected?: boolean;
  connected?: boolean;
  shake?: boolean;
  onClick?: () => void;
  rightSlot?: React.ReactNode;
}

export const AppCard = ({ name, color, tint, Icon, selected, connected, shake, onClick, rightSlot }: AppCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    onClick={onClick}
    className={cn(
      "relative cursor-pointer rounded-xl p-5 border bg-card shadow-card-sm transition-all flex items-center gap-4",
      selected ? "border-gradient-brand" : "border-border",
      shake && "animate-shake",
    )}
    style={selected ? { backgroundColor: tint } : undefined}
  >
    <div
      className="h-11 w-11 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: tint, color }}
    >
      <Icon className="h-6 w-6" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-[15px]">{name}</div>
      {connected && (
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-brand-green font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
          Connected
        </div>
      )}
    </div>
    {connected ? (
      <div className="h-7 w-7 rounded-full bg-brand-green text-white flex items-center justify-center">
        <Check className="h-4 w-4" strokeWidth={3} />
      </div>
    ) : selected ? (
      <div className="h-6 w-6 rounded-md bg-gradient-brand text-white flex items-center justify-center">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </div>
    ) : (
      rightSlot ?? <div className="h-6 w-6 rounded-md border-2 border-border" />
    )}
  </motion.div>
);