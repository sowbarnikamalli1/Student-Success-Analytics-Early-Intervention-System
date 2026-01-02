// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Faculty Pages
import Dashboard from "../pages/Dashboard";
import StudentsList from "../pages/StudentsList";
import PredictionForm from "../pages/PredictionFormBulk";
import CSVUpload from "../pages/CSVUpload";
import RiskAlerts from "../pages/RiskAlerts";
import Profile from "../pages/Profile";

// Student Pages
import StudentDashboard from "../pages/StudentDashboard";
import Goals from "../pages/Goals";
import Recommendations from "../pages/Recommendations";
import History from "../pages/History";

// Auth / Other Pages
import Login from "../pages/Login";
import Unauthorized from "../pages/Unauthorized"; // Create this page for role denial

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Faculty Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <StudentsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prediction"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <PredictionForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <CSVUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute allowedRoles={["faculty"]}>
            <RiskAlerts />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Recommendations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <History />
          </ProtectedRoute>
        }
      />

      {/* Shared Profile Page */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["faculty", "student"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
