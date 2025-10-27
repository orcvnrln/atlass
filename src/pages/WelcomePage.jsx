import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, Zap } from 'lucide-react';

const WelcomePage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // This component will redirect, but if for some reason it doesn't, show a fallback
  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-8">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to <span className="text-accent">Blommy</span>
        </h1>

        <p className="text-xl text-text-secondary mb-8">
          Advanced AI-powered trading platform for institutional investors
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card-bg rounded-xl p-6 card-elevation">
            <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Secure Trading</h3>
            <p className="text-text-secondary text-sm">
              Bank-level security with advanced encryption and risk management
            </p>
          </div>

          <div className="bg-card-bg rounded-xl p-6 card-elevation">
            <BarChart3 className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Analytics</h3>
            <p className="text-text-secondary text-sm">
              Live market data and advanced portfolio analysis tools
            </p>
          </div>

          <div className="bg-card-bg rounded-xl p-6 card-elevation">
            <Zap className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Insights</h3>
            <p className="text-text-secondary text-sm">
              Machine learning algorithms for optimal trading strategies
            </p>
          </div>
        </div>

        <div className="text-text-secondary">
          Redirecting you to the appropriate page...
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
