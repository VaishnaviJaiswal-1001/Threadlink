import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";

const AppLayout = () => (
  <div className="min-h-screen flex bg-surface">
    <Sidebar />
    <main className="flex-1 min-w-0">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;