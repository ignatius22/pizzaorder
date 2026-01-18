import React, { Component, ErrorInfo, ReactNode } from 'react';
import LinkButton from './LinkButton';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold mb-4 text-stone-800">Something went wrong 😢</h1>
          <p className="mb-6 text-stone-600 max-w-md">
            We're sorry, but an unexpected error occurred. Please try refreshing the page or going back.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-pizza-500 text-stone-800 px-4 py-2 rounded-full font-semibold hover:bg-pizza-400 transition-colors"
            >
              Reload Page
            </button>
            <LinkButton to="/">&larr; Back to Home</LinkButton>
          </div>
          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded text-left overflow-auto max-w-full">
              <p className="font-mono text-sm text-red-700">{this.state.error?.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
