import { Component, type ErrorInfo, type ReactNode } from "react";

import { ServerErrorPage } from "@/features/errors/pages/ServerErrorPage";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Top-level catch for uncaught render-time errors anywhere in the
 * routed app. Mounted inside <BrowserRouter> (see App.tsx) so its
 * fallback UI — ServerErrorPage, which uses <Link> — still has Router
 * context available. A caught error only ever indicates a genuine bug
 * (a query/mutation error is handled per-page via ErrorState long
 * before it would ever reach here); this exists purely so an unhandled
 * exception shows a real page instead of a blank white screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught render error:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ServerErrorPage />;
    }

    return this.props.children;
  }
}
