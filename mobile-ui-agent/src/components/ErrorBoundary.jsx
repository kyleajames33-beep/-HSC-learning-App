import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof this.props.onReset === 'function') {
      this.props.onReset();
    }
  };

  handleRetry = () => {
    if (typeof this.props.onRetry === 'function') {
      this.props.onRetry();
    }
    this.resetErrorBoundary();
  };

  handleReload = () => {
    window.location.reload();
  };

  renderFallback() {
    const { fallback } = this.props;
    const { error, errorInfo } = this.state;

    if (React.isValidElement(fallback)) {
      return React.cloneElement(fallback, {
        error,
        errorInfo,
        resetErrorBoundary: this.resetErrorBoundary,
        onRetry: this.handleRetry
      });
    }

    if (typeof fallback === 'function') {
      return fallback({
        error,
        errorInfo,
        resetErrorBoundary: this.resetErrorBoundary,
        onRetry: this.handleRetry
      });
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something went wrong
          </h1>

          <p className="text-gray-600 mb-6">
            We&apos;re sorry for the inconvenience. The app encountered an unexpected error.
          </p>

          <div className="space-y-3">
            <button
              onClick={this.handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Try Again
            </button>

            <button
              onClick={this.handleReload}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Reload App
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto text-red-600">
                {error.toString()}
                {errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </motion.div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  onError: PropTypes.func,
  onReset: PropTypes.func,
  onRetry: PropTypes.func
};

export default ErrorBoundary;
