import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Menu } from "lucide-react";
import AIChatbot from "./AIChatbot";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <Header
          onMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          mobileMenuOpen={mobileMenuOpen}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-4">
          <Outlet />
           {/* <AIChatbot /> */}
        </main>
      </div>
    </div>
  );
};

export default Layout;