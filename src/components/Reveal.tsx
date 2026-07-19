import { ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

interface Props {
  children: ReactNode;
  /** Retardo en ms para escalonar apariciones consecutivas */
  delay?: number;
  className?: string;
}

/* Envoltorio de aparición suave al hacer scroll (fade + leve subida).
   Con prefers-reduced-motion la transición es instantánea (regla global). */
const Reveal = ({ children, delay = 0, className = "" }: Props) => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
