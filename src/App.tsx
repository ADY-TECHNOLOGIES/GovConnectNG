import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import MainLayout from "./components/layout/MainLayout";

import Splash from "./pages/Auth/Splash";
import Welcome from "./pages/Auth/Welcome";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import OTPVerification from "./pages/Auth/OTPVerification";
import CompleteProfile from "./pages/Auth/CompleteProfile";

import Home from "./pages/Home";
import Reports from "./pages/Reports";
import ReportDetails from "./pages/ReportDetails";
import NewReport from "./pages/NewReport";
import Services from "./pages/Services";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReportDetails from "./pages/admin/AdminReportDetails";

import { Toaster } from "sonner";

/* ---------------- PUBLIC ROUTE ---------------- */

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isProfileComplete } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user && isProfileComplete) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/home"}
        replace
      />
    );
  }

  return <>{children}</>;
};

/* ---------------- PROTECTED ROUTE ---------------- */

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isProfileComplete } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
};

/* ---------------- PROFILE ROUTE ---------------- */

const ProtectedRouteNoProfile = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/* ---------------- ADMIN ROUTE ---------------- */

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

/* ---------------- APP ---------------- */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          {/* Splash */}
          <Route path="/" element={<Splash />} />

          {/* Public */}
          <Route
            path="/welcome"
            element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <OTPVerification />
              </PublicRoute>
            }
          />

          {/* Complete Profile */}

          <Route
            path="/complete-profile"
            element={
              <ProtectedRouteNoProfile>
                <CompleteProfile />
              </ProtectedRouteNoProfile>
            }
          />

          {/* Protected */}

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />

            <Route path="/reports" element={<Reports />} />

            <Route path="/reports/new" element={<NewReport />} />

            <Route path="/reports/:id" element={<ReportDetails />} />

            <Route path="/services" element={<Services />} />

            <Route path="/notifications" element={<Notifications />} />

            <Route path="/profile" element={<Profile />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/reports/:id"
              element={
                <AdminRoute>
                  <AdminReportDetails />
                </AdminRoute>
              }
            />
          </Route>

          {/* Catch All */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

        <Toaster position="top-center" richColors />

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;