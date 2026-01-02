import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Sidebar component for SSAES
 * - Shows links based on user role
 * - Highlights active route
 */
const Sidebar = () => {
  const { user } = useAuth();

  // Links for faculty
  const facultyLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Students", path: "/students" },
    { name: "Risk Alerts", path: "/alerts" },
    { name: "Profile", path: "/profile" },
  ];

  // Links for students
  const studentLinks = [
    { name: "Dashboard", path: "/student-dashboard" },
    { name: "Goals", path: "/goals" },
    { name: "Recommendations", path: "/recommendations" },
    { name: "History", path: "/history" },
    { name: "Profile", path: "/profile" },
  ];

  const links = user?.role === "faculty" ? facultyLinks : studentLinks;

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md p-4 fixed">
      <h2 className="text-xl font-bold mb-6">SSAES</h2>
      <nav className="flex flex-col space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded hover:bg-blue-100 transition-colors ${
                isActive ? "bg-blue-100 font-semibold" : ""
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
