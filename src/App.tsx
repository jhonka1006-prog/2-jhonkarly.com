import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

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
const Privacidad = lazy(() => import("@/pages/Privacidad"));
const Terminos = lazy(() => import("@/pages/Terminos"));
const OverviewPage = lazy(() => import("@/pages/dashboard/OverviewPage"));
const UsersPage = lazy(() => import("@/pages/dashboard/UsersPage"));
const PrensaAdminPage = lazy(() => import("@/pages/dashboard/PrensaAdminPage"));
const TiendaAdminPage = lazy(() => import("@/pages/dashboard/TiendaAdminPage"));
const PedidosAdminPage = lazy(() => import("@/pages/dashboard/PedidosAdminPage"));
const CompetenciasAdminPage = lazy(() => import("@/pages/dashboard/CompetenciasAdminPage"));
const TrayectoriaAdminPage = lazy(() => import("@/pages/dashboard/TrayectoriaAdminPage"));
const SponsorsAdminPage = lazy(() => import("@/pages/dashboard/SponsorsAdminPage"));
const PrensaKit = lazy(() => import("@/pages/PrensaKit"));
const FacturacionAdminPage = lazy(() => import("@/pages/dashboard/FacturacionAdminPage"));

/* staleTime evita repetir la misma consulta al re-montar componentes o volver
   a la pestaña; los datos del sitio cambian poco y se refrescan al invalidar. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
      <ScrollToTop />
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
          <Route path="/privacidad"      element={<Privacidad />} />
          <Route path="/terminos"        element={<Terminos />} />
          <Route path="/mi-cuenta"       element={<ProtectedRoute><MiCuenta /></ProtectedRoute>} />

          {/* ── Dashboard (layout con sidebar + rutas anidadas) ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "master"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index         element={<OverviewPage />} />
            {/* Gestión de usuarios: solo la cuenta maestra */}
            <Route
              path="usuarios"
              element={
                <ProtectedRoute allowedRoles={["master"]}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route path="mi-cuenta" element={<MiCuenta />} />
            <Route path="prensa"   element={<PrensaAdminPage />} />
            <Route path="tienda"   element={<TiendaAdminPage />} />
            <Route path="pedidos"  element={<PedidosAdminPage />} />
            <Route path="competencias" element={<CompetenciasAdminPage />} />
            <Route path="trayectoria" element={<TrayectoriaAdminPage />} />
            <Route path="sponsors" element={<SponsorsAdminPage />} />
            {/* Datos fiscales: solo la cuenta maestra */}
            <Route
              path="facturacion"
              element={
                <ProtectedRoute allowedRoles={["master"]}>
                  <FacturacionAdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ── Rutas privadas — Prensa ── */}
          <Route
            path="/prensa/kit"
            element={
              <ProtectedRoute allowedRoles={["master", "admin", "prensa"]}>
                <PrensaKit />
              </ProtectedRoute>
            }
          />

          {/* ── Rutas privadas — Premium ── */}
          <Route
            path="/exclusivo"
            element={
              <ProtectedRoute allowedRoles={["master", "admin", "premium"]}>
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
      {!isDash && <CookieBanner />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ErrorBoundary>
            <AppShell />
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
