import React from "react";
import Sidebar from "../mollecules/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-neutral-50">
        <div className="">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
