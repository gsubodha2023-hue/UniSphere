import React from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import LiveClock from "../components/ui/LiveClock";
import NotificationBell from "../components/notifications/NotificationBell";
import { logout } from "../redux/slices/authSlice";
import useSocket from "../hooks/useSocket";

const DashboardLayout = () => {
  useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div>
            <h1 className="text-lg font-semibold">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-xs text-gray-500">
              Let's make today productive.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LiveClock />
            <NotificationBell />
            <button
              onClick={() => dispatch(logout())}
              className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
