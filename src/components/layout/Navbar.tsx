import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "@/assets/threadlink-logo.png";
import { GhostButton, GradientButton } from "@/components/ui/GradientButton";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur-md bg-background/75 transition-all",
        scrolled && "border-b border-border shadow-card-sm",
      )}
    >
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Threadlink" className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[14px] text-text-secondary">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#flow" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><GhostButton>Log in</GhostButton></Link>
          <Link to="/signup"><GradientButton>Get Started</GradientButton></Link>
        </div>
      </div>
    </header>
  );
};