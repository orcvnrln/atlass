import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { errorLogger, ERROR_TYPES, ERROR_SEVERITY } from '@/lib/errorHandler';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      maxRetries: 3
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    errorLogger.log({
      type: ERROR_TYPES.COMPONENT,
      severity: ERROR_SEVERITY.HIGH,
      message: error.message || 'Component error occurred',
      stack: error.stack,
      componentStack: errorInfo.componentStack
    }, {
      componentName: this.props.name || 'Unknown',
      retryCount: this.state.retryCount
    });

    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    const { retryCount, maxRetries } = this.state;
    
    if (retryCount < maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1
      });
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, retryCount, maxRetries } = this.state;
      const { fallback: FallbackComponent, showDetails = false } = this.props;

      // Use custom fallback if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            errorInfo={this.state.errorInfo}
            retry={this.handleRetry}
            reset={this.handleReset}
            goHome={this.handleGoHome}
            canRetry={retryCount < maxRetries}
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 rounded-lg border border-gray-700 p-6 text-center">
            <div className="mb-4">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-200 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-400 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>

            <div className="space-y-3">
              {retryCount < maxRetries && (
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again ({retryCount + 1}/{maxRetries})
                </button>
              )}

              <button
                onClick={this.handleReset}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Component
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </button>
            </div>

            {showDetails && process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Show Error Details
                </summary>
                <div className="mt-2 p-3 bg-gray-800 rounded border border-gray-700">
                  <pre className="text-xs text-red-400 overflow-auto">
                    {error && error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="mt-4 text-xs text-gray-500">
              Error ID: {Date.now()}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
