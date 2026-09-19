import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    // Auto-recover from stale Vercel deployment chunk load errors
    const errorMsg = String(error?.message || '').toLowerCase();
    const isChunkError = 
      errorMsg.includes('failed to fetch dynamically imported module') ||
      errorMsg.includes('importing a module script failed') ||
      errorMsg.includes('loading chunk') ||
      errorMsg.includes('unexpected token \'<\'');

    if (isChunkError) {
      const reloadKey = 'chunk_reload_' + (window.location.pathname || 'app');
      const lastReload = window.sessionStorage.getItem(reloadKey);
      if (!lastReload || Date.now() - Number(lastReload) > 15000) {
        window.sessionStorage.setItem(reloadKey, String(Date.now()));
        console.warn('[ErrorBoundary] Stale chunk detected after deployment. Auto-refreshing...');
        window.location.reload();
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 my-8 mx-auto max-w-lg text-center bg-surface border border-border rounded-2xl shadow-lg animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mb-4">
            <AlertTriangle size={28} />
          </div>
          <h3 className="text-lg font-bold text-primary mb-2">Something went wrong</h3>
          <p className="text-xs text-secondary mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected error occurred while rendering this component. Please try reloading the page.'}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="btn btn-primary text-xs font-semibold flex items-center gap-2"
            >
              <RefreshCw size={14} /> Reload Page
            </button>
            <a
              href="/dashboard"
              className="btn btn-secondary text-xs font-semibold flex items-center gap-2"
            >
              <Home size={14} /> Back to Dashboard
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
