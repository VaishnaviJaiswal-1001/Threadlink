import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export const GradientText = ({ className, children, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("text-gradient-brand", className)} {...props}>
    {children}
  </span>
);