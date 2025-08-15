import React from "react";
import { Outlet } from "react-router";

import ApplicationHeader from "../molecules/ApplicationHeader";
import Sidebar from "../molecules/Sidebar";

const Layout: React.FC = () => {
  return (
    <div className="h-screen flex bg-white">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <ApplicationHeader />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
