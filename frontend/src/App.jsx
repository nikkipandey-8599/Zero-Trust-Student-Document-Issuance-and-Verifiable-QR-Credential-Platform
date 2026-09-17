import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login          from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import RequestDocument  from "./pages/RequestDocument";
import TrackRequest     from "./pages/TrackRequest";
import MyDocuments      from "./pages/MyDocuments";
import StaffDashboard   from "./pages/StaffDashboard";
import ReviewRequest    from "./pages/ReviewRequest";
import AdminPanel       from "./pages/AdminPanel";
import VerifyDocument   from "./pages/VerifyDocument";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Public */}
          <Route path="/login"              element={<Login />} />
          <Route path="/verify"             element={<VerifyDocument />} />
          <Route path="/verify/:credentialId" element={<VerifyDocument />} />
          <Route path="/"                   element={<Navigate to="/login" replace />} />

          {/* Student */}
          <Route path="/dashboard"    element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/request"      element={<ProtectedRoute allowedRoles={["student"]}><RequestDocument /></ProtectedRoute>} />
          <Route path="/track"        element={<ProtectedRoute allowedRoles={["student"]}><TrackRequest /></ProtectedRoute>} />
          <Route path="/my-documents" element={<ProtectedRoute allowedRoles={["student"]}><MyDocuments /></ProtectedRoute>} />

          {/* Staff */}
          <Route path="/staff"                   element={<ProtectedRoute allowedRoles={["staff","admin"]}><StaffDashboard /></ProtectedRoute>} />
          <Route path="/staff/review/:requestId" element={<ProtectedRoute allowedRoles={["staff","admin"]}><ReviewRequest /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPanel /></ProtectedRoute>} />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-gray-500">
              <p className="text-lg font-semibold text-gray-800">Access denied</p>
              <p className="text-sm">You don't have permission to view this page.</p>
              <a href="/login" className="text-sm text-blue-500 hover:underline">Back to login</a>
            </div>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}