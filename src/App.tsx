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
import EditProfile from "./pages/Auth/EditProfile";

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

/* =========================================================
   LOADING SCREEN
========================================================= */

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />

        <p className="text-sm text-muted-foreground">
          Loading GovConnect NG...
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   ROOT REDIRECT
========================================================= */

const RootRedirect = () => {
  const {
    user,
    isLoading,
    isProfileComplete,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  /* No authenticated user */
  if (!user) {
    return <Splash />;
  }

  /* Authenticated but profile incomplete */
  if (!isProfileComplete) {
    return (
      <Navigate
        to="/complete-profile"
        replace
      />
    );
  }

  /* Authenticated user */
  if (user.role === "admin") {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/home"
      replace
    />
  );
};

/* =========================================================
   PUBLIC ROUTE
========================================================= */

const PublicRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    user,
    isLoading,
    isProfileComplete,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  /*
   * If authenticated but profile is incomplete,
   * allow the authentication flow to send the
   * user to Complete Profile.
   */
  if (user && isProfileComplete) {
    return (
      <Navigate
        to={
          user.role === "admin"
            ? "/admin"
            : "/home"
        }
        replace
      />
    );
  }

  return <>{children}</>;
};

/* =========================================================
   PROTECTED ROUTE
========================================================= */

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    user,
    isLoading,
    isProfileComplete,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  /* Not authenticated */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* Profile incomplete */
  if (!isProfileComplete) {
    return (
      <Navigate
        to="/complete-profile"
        replace
      />
    );
  }

  return <>{children}</>;
};

/* =========================================================
   PROFILE / COMPLETE PROFILE ROUTE
========================================================= */

const ProtectedRouteNoProfile = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    user,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
};

/* =========================================================
   ADMIN ROUTE
========================================================= */

const AdminRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    user,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return <>{children}</>;
};

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =================================================
              ROOT
          ================================================= */}

          <Route
            path="/"
            element={<RootRedirect />}
          />

          {/* =================================================
              PUBLIC AUTH ROUTES
          ================================================= */}

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

          {/* =================================================
              COMPLETE PROFILE
          ================================================= */}

          <Route
            path="/complete-profile"
            element={
              <ProtectedRouteNoProfile>
                <CompleteProfile />
              </ProtectedRouteNoProfile>
            }
          />

          {/* =================================================
              PROTECTED APPLICATION
          ================================================= */}

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >

            {/* USER HOME */}

            <Route
              path="/home"
              element={<Home />}
            />

            {/* REPORTS */}

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/reports/new"
              element={<NewReport />}
            />

            <Route
              path="/reports/:id"
              element={<ReportDetails />}
            />

            {/* SERVICES */}

            <Route
              path="/services"
              element={<Services />}
            />

            {/* NOTIFICATIONS */}

            <Route
              path="/notifications"
              element={<Notifications />}
            />

            {/* PROFILE */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/profile/edit"
              element={<EditProfile />}
            />

            {/* =================================================
                ADMIN
            ================================================= */}

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

          {/* =================================================
              CATCH ALL
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

        <Toaster
          position="top-center"
          richColors
        />

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;