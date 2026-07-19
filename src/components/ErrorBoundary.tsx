import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-[var(--px)]">
          <div className="max-w-[480px] text-center">
            <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-4">
              Error inesperado
            </span>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.9] text-foreground mb-6">
              Algo salió<br />
              <span className="text-g300">mal</span>
            </h1>
            <p className="font-body font-light text-sm text-g300 leading-[1.85] mb-8">
              Ocurrió un error inesperado. Por favor, recarga la página o vuelve al inicio.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
              >
                Recargar página
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-8 py-3 border border-g700 text-g300 font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-colors hover:border-g300 hover:text-foreground"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
