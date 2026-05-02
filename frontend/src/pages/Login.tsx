import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/threadlink-logo.png";
import { GradientButton } from "@/components/ui/GradientButton";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.4 29 4.5 24 4.5 16.2 4.5 9.4 8.9 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 43.5c5.1 0 9.7-1.7 13.2-4.7l-6.1-5c-2 1.4-4.4 2.2-7.1 2.2-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.3 39 16.1 43.5 24 43.5z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 5l6.1 5c-.4.4 6.6-4.8 6.6-14 0-1.2-.1-2.4-.4-3.5z"/>
  </svg>
);

interface AuthCardProps {
  mode: "login" | "signup";
}

export const AuthCard = ({ mode }: AuthCardProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [name, setName] = useState(""); // Only used for signup
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await api.post("/auth/signup", { name: name || email.split("@")[0], email, password: pwd });
        if (res.data.success) {
          login({ accessToken: res.data.data.accessToken, refreshToken: res.data.data.refreshToken }, res.data.data.user);
          navigate("/onboarding");
        }
      } else {
        const res = await api.post("/auth/login", { email, password: pwd });
        if (res.data.success) {
          const user = res.data.data.user;
          login({ accessToken: res.data.data.accessToken, refreshToken: res.data.data.refreshToken }, user);
          navigate(user.onboardingCompleted ? "/dashboard" : "/onboarding");
        }
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: mode === "login" ? "Login Failed" : "Signup Failed",
        description: err.response?.data?.error?.message || "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="border-gradient-brand rounded-2xl p-[1px]">
          <div className="bg-card rounded-2xl shadow-card-md p-10">
            <div className="flex flex-col items-center mb-6">
              <Link to="/"><img src={logo} alt="Threadlink" className="h-[160px] w-auto" /></Link>
            </div>
            <h2 className="text-[24px] font-semibold text-center">Welcome to Threadlink</h2>
            <p className="text-center text-text-secondary mt-1 text-[14px]">
              {mode === "login" ? "Sign in to continue" : "Create your account"}
            </p>

            <a
              href="http://localhost:5000/api/auth/google"
              className="mt-6 w-full h-11 rounded-md border border-border bg-card hover:bg-surface hover:shadow-card-sm transition-all flex items-center justify-center gap-3 text-[14px] font-medium relative"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </a>

            <div className="my-5 flex items-center gap-3 text-[12px] text-text-muted">
              <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-11 px-3 rounded-md border border-border bg-background text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                  />
                </motion.div>
              )}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-md border border-border bg-background text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <input
                  type="password"
                  placeholder="Password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  className="w-full h-11 px-3 rounded-md border border-border bg-background text-[14px] focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                />
              </motion.div>
              <GradientButton fullWidth type="submit" disabled={loading}>
                {loading ? "Please wait..." : (mode === "login" ? "Sign in" : "Create account")}
              </GradientButton>
            </form>

            <p className="mt-5 text-center text-[13px] text-text-secondary">
              {mode === "login" ? (
                <>Don't have an account? <Link to="/signup" className="font-semibold text-foreground hover:underline">Sign up</Link></>
              ) : (
                <>Already have an account? <Link to="/login" className="font-semibold text-foreground hover:underline">Sign in</Link></>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Login = () => <AuthCard mode="login" />;
export default Login;