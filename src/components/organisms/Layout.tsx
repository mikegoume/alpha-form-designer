import React from "react";
import Sidebar from "../mollecules/Sidebar";
import ApplicationHeader from "../mollecules/ApplicationHeader";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <main className="flex-1 bg-white">
        <ApplicationHeader />
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
