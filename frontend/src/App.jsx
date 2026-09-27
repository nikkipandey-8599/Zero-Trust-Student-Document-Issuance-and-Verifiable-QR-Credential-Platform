import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StudentRequests from "./pages/StudentRequests";
import StaffRequests from "./pages/StaffRequests";
import Credential from "./pages/Credential";
import VerifyCredential from "./pages/VerifyCredential";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Navigate to="/verify" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/verify" element={<VerifyCredential />} />

      <Route
        path="/verify/:credentialId"
        element={<VerifyCredential />}
      />

      {/* Student */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/requests/new"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentRequests />
          </ProtectedRoute>
        }
      />

      {/* Staff */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/requests"
        element={
          <ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}>
            <StaffRequests />
          </ProtectedRoute>
        }
      />

      {/* Credential */}
      <Route
        path="/credential/:credentialId"
        element={
          <ProtectedRoute allowedRoles={["STAFF", "ADMIN", "STUDENT"]}>
            <Credential />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/verify" replace />}
      />

    </Routes>
  );
}