"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import * as Sentry from "@sentry/nextjs";
import { StarAngryLottie } from "@/components/ui/lottie-animation";
import { RefreshCw } from "lucide-react";

type ErrorFallbackProps = {
  error: Error;
  reset: () => void;
};

export const ErrorFallback = ({ reset }: ErrorFallbackProps) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
    <div className="w-40 h-40 mb-4 drop-shadow-lg">
      <StarAngryLottie className="w-full h-full" />
    </div>
    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
      Algo correu mal
    </h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm leading-relaxed">
      Ocorreu um erro inesperado. Podes tentar novamente ou voltar atrás.
    </p>
    <button
      onClick={reset}
      className="mt-6 py-3 px-6 text-base font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-2xl border-b-4 border-sky-600 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Tentar novamente
    </button>
  </div>
);

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      extra: { componentStack: errorInfo.componentStack },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      return (
        this.props.fallback ?? (
          <ErrorFallback
            error={this.state.error}
            reset={this.handleReset}
          />
        )
      );
    }
    return this.props.children;
  }
}
