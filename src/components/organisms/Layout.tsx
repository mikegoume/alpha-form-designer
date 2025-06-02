import React from "react";
import Sidebar from "../mollecules/Sidebar";
import ApplicationHeader from "../mollecules/ApplicationHeader";
import { Outlet } from "react-router";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <main className="flex-1 bg-white">
        <ApplicationHeader />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
