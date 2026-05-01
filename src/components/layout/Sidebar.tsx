import { NavLink, useLocation } from "react-router-dom";
import { Home, CalendarDays, Workflow, Sparkles, MessageCircle, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/threadlink-logo.png";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", href: "/dashboard", Icon: Home },
  { label: "Today", href: "/today", Icon: CalendarDays },
  { label: "Workflows", href: "/workflows", Icon: Workflow },
  { label: "AI Suggestions", href: "/dashboard?panel=ai", Icon: Sparkles },
  { label: "Chatbot", href: "/dashboard?panel=chat", Icon: MessageCircle },
  { label: "Settings", href: "/settings", Icon: Settings },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const Inner = () => (
    <div className="flex flex-col h-full bg-card">
      <div className="px-5 h-16 flex items-center border-b border-border">
        <img src={logo} alt="Threadlink" className="h-7 w-auto" />
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map(({ label, href, Icon }) => {
          const base = href.split("?")[0];
          const active = pathname === base;
          return (
            <NavLink
              key={label}
              to={href}
              onClick={() => setOpen(false)}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors",
                active ? "bg-elevated" : "text-text-secondary hover:text-foreground hover:bg-surface",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gradient-brand" />
              )}
              <Icon className={cn("h-[18px] w-[18px]", active && "text-foreground")} />
              <span className={cn(active && "text-gradient-brand font-semibold")}>{label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 p-2">
          <div className="h-9 w-9 rounded-full bg-gradient-brand text-white flex items-center justify-center font-semibold text-[13px]">AM</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium truncate">Alex Morgan</div>
            <div className="text-[11px] text-text-muted truncate">alex@threadlink.io</div>
          </div>
          <button className="text-text-muted hover:text-foreground" aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 h-10 w-10 rounded-md bg-card border border-border shadow-card-sm flex items-center justify-center"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)}>
          <div className="w-[260px] h-full border-r border-border" onClick={(e) => e.stopPropagation()}>
            <Inner />
          </div>
        </div>
      )}
      {/* Desktop */}
      <aside className="hidden md:flex w-[240px] shrink-0 border-r border-border h-screen sticky top-0">
        <Inner />
      </aside>
    </>
  );
};