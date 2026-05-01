import { motion } from "framer-motion";
import { Mail, Zap, CheckCircle2, Calendar, Bell } from "lucide-react";

const nodes = [
  { Icon: Mail, label: "Email", color: "#E8381A" },
  { Icon: Zap, label: "Threadlink AI", color: "#F5861A", center: true },
  { Icon: CheckCircle2, label: "Task", color: "#F5C800" },
  { Icon: Calendar, label: "Calendar", color: "#2BB74A" },
  { Icon: Bell, label: "Notify", color: "#1A6CF5" },
];

export const FlowVisual = () => (
  <div className="relative w-full">
    <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap md:flex-nowrap">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex items-center flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
            className={`relative bg-card border border-border rounded-xl shadow-card-sm px-3 py-3 md:px-4 md:py-4 flex flex-col items-center gap-1.5 min-w-[88px] md:min-w-[120px] ${n.center ? "shadow-card-md" : ""}`}
          >
            {n.center && <span className="absolute inset-0 rounded-xl glow-ring pointer-events-none" />}
            <div
              className="h-9 w-9 md:h-10 md:w-10 rounded-md flex items-center justify-center text-white"
              style={{ background: n.center ? "linear-gradient(135deg, #F5861A, #E8381A)" : n.color }}
            >
              <n.Icon className="h-5 w-5" />
            </div>
            <div className="text-[12px] font-semibold whitespace-nowrap">{n.label}</div>
          </motion.div>
          {i < nodes.length - 1 && (
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 + 0.2 }}
              className="hidden sm:block flex-1 h-6"
              viewBox="0 0 100 24"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`g-${i}`} x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={nodes[i].color} />
                  <stop offset="1" stopColor={nodes[i + 1].color} />
                </linearGradient>
              </defs>
              <motion.path
                d="M0 12 H100"
                stroke={`url(#g-${i})`}
                strokeWidth="2"
                strokeDasharray="6 6"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 + 0.2 }}
              />
            </motion.svg>
          )}
        </div>
      ))}
    </div>
  </div>
);