import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ChatbotPanel } from "./ChatbotPanel";

export const ChatbotButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 h-[52px] w-[52px] rounded-full bg-gradient-brand text-white shadow-card-md flex items-center justify-center"
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
      <ChatbotPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
};