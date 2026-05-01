import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

type Props = Omit<HTMLMotionProps<"button">, "ref"> & {
  size?: "md" | "lg";
  fullWidth?: boolean;
};

export const GradientButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, size = "md", fullWidth, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01, filter: "brightness(1.08)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold text-white rounded-md shadow-card-sm",
          "bg-gradient-brand",
          size === "md" && "h-11 px-6 text-[15px]",
          size === "lg" && "h-12 px-7 text-base rounded-xl",
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
GradientButton.displayName = "GradientButton";

export const GhostButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-11 px-5 text-[15px] font-medium rounded-md",
        "text-foreground hover:bg-elevated transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
GhostButton.displayName = "GhostButton";