import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    <div className="relative flex h-screen">
      <Sidebar />
      <div className="flex-1 px-10 overflow-auto outline-none bg-gray-50 max-w-7xl">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
