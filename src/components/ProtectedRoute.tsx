import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  /** Roles permitidos. Si no se pasa, cualquier usuario autenticado puede entrar. */
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { session, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="font-body text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-g300 animate-pulse">
          Verificando acceso…
        </span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
