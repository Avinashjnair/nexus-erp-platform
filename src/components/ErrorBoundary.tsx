import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  /** Shown in the error header so users know which module failed. */
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.moduleName ?? 'App'}]`, error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-boundary-screen">
        <div className="error-boundary-card">
          <div className="error-boundary-icon">
            <AlertOctagon size={36} strokeWidth={1.2} />
          </div>
          <h2 className="error-boundary-title">
            {this.props.moduleName
              ? `${this.props.moduleName} module crashed`
              : 'Something went wrong'}
          </h2>
          <p className="error-boundary-msg">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <div className="error-boundary-actions">
            <button className="btn btn-primary btn-sm" onClick={this.handleReset}>
              <RefreshCw size={14} />
              Try again
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => window.location.reload()}
            >
              Reload app
            </button>
          </div>
        </div>
      </div>
    );
  }
}
