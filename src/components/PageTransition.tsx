import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PageTransition = ({ children }: Props) => {
  const { pathname } = useLocation();
  // Group all /dashboard/* under the same key so only top-level nav triggers the animation
  const key = pathname.startsWith("/dashboard") ? "dashboard" : pathname;

  return (
    <div key={key} className="page-transition">
      {children}
    </div>
  );
};

export default PageTransition;
