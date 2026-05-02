import { cn } from "@/lib/utils";
import { Priority, Source } from "@/lib/mockData";

const PRIORITY_STYLES: Record<Priority, string> = {
  Urgent: "bg-[hsl(var(--brand-red)/0.10)] text-brand-red",
  High: "bg-[hsl(var(--brand-orange)/0.10)] text-brand-orange",
  Normal: "bg-[hsl(var(--brand-blue)/0.10)] text-brand-blue",
  Low: "bg-elevated text-text-secondary",
};

export const PriorityBadge = ({ priority }: { priority: Priority }) => (
  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide", PRIORITY_STYLES[priority])}>
    {priority}
  </span>
);

const SOURCE_COLORS: Record<Source, string> = {
  Gmail: "text-brand-red",
  Calendar: "text-brand-blue",
};

export const SourcePill = ({ source }: { source: Source }) => (
  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface border border-border", SOURCE_COLORS[source])}>
    From {source}
  </span>
);