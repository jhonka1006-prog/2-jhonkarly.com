import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Lazy-loaded pages (code splitting) ── */
const Index = lazy(() => import("@/pages/Index"));
const SobreMi = lazy(() => import("@/pages/SobreMi"));
const Tienda = lazy(() => import("@/pages/Tienda"));
const Prensa = lazy(() => import("@/pages/Prensa"));
const Trayectoria = lazy(() => import("@/pages/Trayectoria"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const AccesoDenegado = lazy(() => import("@/pages/AccesoDenegado"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const MiCuenta = lazy(() => import("@/pages/MiCuenta"));
const OverviewPage = lazy(() => import("@/pages/dashboard/OverviewPage"));
const UsersPage = lazy(() => import("@/pages/dashboard/UsersPage"));

const queryClient = new QueryClient();

/* ── Loading fallback for Suspense ── */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <span className="font-body text-sm text-g300 tracking-widest uppercase animate-pulse">
      Cargando…
    </span>
  </div>
);

/* ── App shell: hides global Navbar/Footer inside dashboard ── */
const AppShell = () => {
  const { pathname } = useLocation();
  const isDash = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDash && <Navbar />}

      <Suspense fallback={<PageLoader />}>
      <PageTransition>
        <Routes>
          {/* ── Rutas públicas ── */}
          <Route path="/"                element={<Index />} />
          <Route path="/sobre-mi"        element={<SobreMi />} />
          <Route path="/tienda"          element={<Tienda />} />
          <Route path="/prensa"          element={<Prensa />} />
          <Route path="/trayectoria"     element={<Trayectoria />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />
          <Route path="/mi-cuenta"       element={<ProtectedRoute><MiCuenta /></ProtectedRoute>} />

          {/* ── Dashboard (layout con sidebar + rutas anidadas) ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index         element={<OverviewPage />} />
            <Route path="usuarios" element={<UsersPage />} />
          </Route>

          {/* ── Rutas privadas — Prensa ── */}
          <Route
            path="/prensa/kit"
            element={
              <ProtectedRoute allowedRoles={["admin", "prensa"]}>
                <div className="min-h-screen pt-[68px] flex items-center justify-center text-g300 font-body tracking-widest text-sm uppercase">
                  Kit de prensa — en construcción
                </div>
              </ProtectedRoute>
            }
          />

          {/* ── Rutas privadas — Premium ── */}
          <Route
            path="/exclusivo"
            element={
              <ProtectedRoute allowedRoles={["admin", "premium"]}>
                <div className="min-h-screen pt-[68px] flex items-center justify-center text-g300 font-body tracking-widest text-sm uppercase">
                  Contenido exclusivo — en construcción
                </div>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      </Suspense>

      {!isDash && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <AppShell />
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
