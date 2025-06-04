import React from "react";
import { Outlet } from "react-router";

import ApplicationHeader from "../mollecules/ApplicationHeader";
import Sidebar from "../mollecules/Sidebar";

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
