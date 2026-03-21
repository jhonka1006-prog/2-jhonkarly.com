import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AccesoDenegado = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[var(--px)] pt-[68px]">
      <div className="w-full max-w-[480px] text-center">
        <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-4">
          Error 403
        </span>
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.88] text-foreground mb-6">
          Acceso<br />
          <span className="text-g300">Denegado</span>
        </h1>
        <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-10 max-w-[340px] mx-auto">
          No tienes los permisos necesarios para ver esta sección.
          Contacta a Jhonkarly si crees que esto es un error.
        </p>
        <div className="flex flex-col gap-4 items-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
          >
            Volver al inicio
          </Link>
          <button
            onClick={signOut}
            className="font-body text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-g700 hover:text-g300 transition-colors duration-300"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccesoDenegado;
