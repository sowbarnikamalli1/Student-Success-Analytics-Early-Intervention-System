import React from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Topbar component
 * - Shows page title
 * - Welcome message
 * - Logout button
 */
const Topbar = ({ title = "Dashboard" }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Navigate to login page
    window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6 fixed w-full ml-64 z-10">
      {/* Page Title */}
      <h1 className="text-xl font-bold">
        {title} ({user?.role === "faculty" ? "Faculty" : "Student"} Dashboard)
      </h1>

      {/* User info & Logout */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 text-sm">
          Welcome, {user?.name || "User"}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
