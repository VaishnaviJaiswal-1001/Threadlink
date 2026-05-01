import { cn } from "@/lib/utils";

export const MiniCalendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = today.toLocaleString("en-US", { month: "long" });
  const taskDays = new Set([3, 7, 12, 15, 21, 24, today.getDate()]);
  const dotColors: Record<number, string> = { 3: "#E8381A", 7: "#1A6CF5", 12: "#2BB74A", 15: "#F5C800", 21: "#F5861A", 24: "#1A6CF5" };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[14px] font-semibold">{monthName} {year}</h4>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[11px] text-text-muted text-center mb-1">
        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          const isToday = c === today.getDate();
          const hasTask = c !== null && taskDays.has(c);
          return (
            <div key={i} className="aspect-square flex flex-col items-center justify-center text-[12px]">
              {c && (
                <>
                  <div className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center",
                    isToday ? "bg-gradient-brand text-white font-semibold" : "text-foreground"
                  )}>
                    {c}
                  </div>
                  {hasTask && !isToday && (
                    <span className="h-1 w-1 rounded-full mt-0.5" style={{ backgroundColor: dotColors[c] ?? "#94a3b8" }} />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};