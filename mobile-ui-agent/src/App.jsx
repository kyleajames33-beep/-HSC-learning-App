import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { authAPI } from './utils/api';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';
import { usePWA } from './hooks/usePWA';
import { useMobileOptimization } from './hooks/useMobileOptimization';

// Import pages directly to avoid dynamic import issues
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';  
import ForgotPassword from './pages/ForgotPassword';
import DashboardFixed from './pages/Dashboard';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import QuizSetup from './pages/QuizSetup';
import PathwayQuizSetup from './pages/PathwayQuizSetup';

// Loading component for better UX
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

const withErrorBoundary = (Component, displayName) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `WithErrorBoundary(${displayName || Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

const WelcomeWithBoundary = withErrorBoundary(Welcome, 'Welcome');
const LoginWithBoundary = withErrorBoundary(Login, 'Login');
const SignUpWithBoundary = withErrorBoundary(SignUp, 'SignUp');
const ForgotPasswordWithBoundary = withErrorBoundary(ForgotPassword, 'ForgotPassword');
const DashboardWithBoundary = withErrorBoundary(DashboardFixed, 'Dashboard');
const QuizWithBoundary = withErrorBoundary(Quiz, 'Quiz');
const QuizResultsWithBoundary = withErrorBoundary(QuizResults, 'QuizResults');
const QuizSetupWithBoundary = withErrorBoundary(QuizSetup, 'QuizSetup');
const PathwayQuizSetupWithBoundary = withErrorBoundary(PathwayQuizSetup, 'PathwayQuizSetup');

// PWA Install Banner Component
const PWAInstallBanner = () => {
  const { canInstall, installPWA, isOnline } = usePWA();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner after 5 seconds if PWA can be installed
    if (canInstall) {
      const timer = setTimeout(() => setShowBanner(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  if (!showBanner || !canInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-lg z-50 mobile-optimized">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold">Install HSC Learning App</h3>
          <p className="text-sm opacity-90">
            {isOnline ? 'Get the full experience with offline access!' : 'Reconnect to finish installing the app.'}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setShowBanner(false)}
            className="px-3 py-1 text-sm bg-white/20 rounded-lg hover:bg-white/30 touch-optimized"
          >
            Later
          </button>
          <button
            onClick={async () => {
              await installPWA();
              setShowBanner(false);
            }}
            className={`px-3 py-1 text-sm rounded-lg touch-optimized ${isOnline ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-white/30 text-white cursor-not-allowed'}`}
            disabled={!isOnline}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

// Offline Banner Component
const OfflineBanner = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 p-2 text-center text-sm font-medium z-50">
      You&apos;re offline - some features may be limited
    </div>
  );
};

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { getPerformanceConfig } = useMobileOptimization();
  const performanceConfig = getPerformanceConfig();
  const bypassAuth = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';
  const dashboardPageProps = {
    PathwayQuizSetupComponent: PathwayQuizSetupWithBoundary,
    QuizSetupComponent: QuizSetupWithBoundary,
    QuizComponent: QuizWithBoundary,
    QuizResultsComponent: QuizResultsWithBoundary
  };

  useEffect(() => {
    if (!bypassAuth || typeof window === 'undefined') {
      return;
    }

    const mockUser = {
      id: 'dev-user-123',
      name: 'Dev User',
      email: 'dev@example.com',
      createdAt: new Date().toISOString(),
      profile: {}
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'dev-mock-token');
  }, [bypassAuth]);

  if (bypassAuth) {
    return (
      <div className={`${performanceConfig.enableAnimations ? '' : 'low-power'}`}>
        <OfflineBanner />
        <DashboardWithBoundary {...dashboardPageProps} />
        <PWAInstallBanner />
      </div>
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return (
      <div className={`${performanceConfig.enableAnimations ? '' : 'low-power'}`}>
        <OfflineBanner />
        <DashboardWithBoundary {...dashboardPageProps} />
        <PWAInstallBanner />
      </div>
    );
  }

  return (
    <div className={`${performanceConfig.enableAnimations ? '' : 'low-power'}`}>
      <OfflineBanner />
      <AuthFlow />
      <PWAInstallBanner />
    </div>
  );
};

const AuthFlow = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [authMessage, setAuthMessage] = useState('');
  const { login, clearError } = useAuth();

  useEffect(() => {
    // Check for session expired message
    const message = localStorage.getItem('authMessage');
    if (message) {
      setAuthMessage(message);
      localStorage.removeItem('authMessage');
      // Clear message after showing
      setTimeout(() => setAuthMessage(''), 5000);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      clearError();
      const { rememberMe, ...loginData } = credentials;
      const data = await authAPI.login(loginData);
      if (!data?.user || !data?.token) {
        throw new Error('Login failed. Please try again.');
      }
      login(data.user, data.token, rememberMe);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      throw new Error(message);
    }
  };

  const handleSignUp = async (userData) => {
    try {
      clearError();
      const data = await authAPI.register(userData);
      if (!data?.user || !data?.token) {
        throw new Error('Sign up failed. Please try again.');
      }
      login(data.user, data.token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Sign up failed. Please try again.';
      throw new Error(message);
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      clearError();
      await authAPI.forgotPassword(email);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email.';
      throw new Error(message);
    }
  };

  const screens = {
    welcome: (
      <WelcomeWithBoundary
        onGetStarted={() => setCurrentScreen('signup')}
        onSignIn={() => setCurrentScreen('login')}
      />
    ),
    login: (
      <LoginWithBoundary
        onBack={() => setCurrentScreen('welcome')}
        onLogin={handleLogin}
        onSignUp={() => setCurrentScreen('signup')}
        onForgotPassword={() => setCurrentScreen('forgot-password')}
      />
    ),
    signup: (
      <SignUpWithBoundary
        onBack={() => setCurrentScreen('welcome')}
        onSignUp={handleSignUp}
        onSignIn={() => setCurrentScreen('login')}
      />
    ),
    'forgot-password': (
      <ForgotPasswordWithBoundary
        onBack={() => setCurrentScreen('login')}
        onResetPassword={handleForgotPassword}
      />
    )
  };

  return (
    <div className="relative">
      {/* Session expired message */}
      {authMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{authMessage}</span>
            <button
              onClick={() => setAuthMessage('')}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
      {screens[currentScreen]}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <AuthProvider>
        <GamificationProvider>
          <AuthenticatedApp />
        </GamificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;






