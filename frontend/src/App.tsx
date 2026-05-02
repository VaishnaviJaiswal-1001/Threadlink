import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import AppLayout from "./pages/AppLayout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Today from "./pages/Today.tsx";
import Workflows from "./pages/Workflows.tsx";
import Activity from "./pages/Activity.tsx";
import Settings from "./pages/Settings.tsx";
import GmailInbox from "./pages/GmailInbox.tsx";
import CalendarView from "./pages/CalendarView.tsx";
import { ChatbotButton } from "./components/features/ChatbotButton";

import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/today" element={<Today />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/apps/gmail" element={<GmailInbox />} />
              <Route path="/calendar" element={<CalendarView />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatbotButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
