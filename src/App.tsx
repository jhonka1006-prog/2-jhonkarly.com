import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Index from "@/pages/Index";
import SobreMi from "@/pages/SobreMi";
import Tienda from "@/pages/Tienda";
import Prensa from "@/pages/Prensa";
import Trayectoria from "@/pages/Trayectoria";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AccesoDenegado from "@/pages/AccesoDenegado";
import NotFound from "@/pages/NotFound";
import MiCuenta from "@/pages/MiCuenta";
import OverviewPage from "@/pages/dashboard/OverviewPage";
import UsersPage from "@/pages/dashboard/UsersPage";

const queryClient = new QueryClient();

/* ── App shell: hides global Navbar/Footer inside dashboard ── */
const AppShell = () => {
  const { pathname } = useLocation();
  const isDash = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDash && <Navbar />}

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

      {!isDash && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
