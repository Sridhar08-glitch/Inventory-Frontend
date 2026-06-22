import { useState } from "react";
import Sidebar from "./components/layout/SideBar";
import TopBar from "./components/layout/TopBar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}