import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, Zap, ArrowRight, PlayCircle } from 'lucide-react';

type WelcomePageProps = {
  mode?: 'default' | 'training';
};

const WelcomePage: React.FC<WelcomePageProps> = ({ mode = 'default' }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
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

  const goToLogin = () => navigate('/login');
  const goToTraining = () => navigate('/training');

  const features = [
    {
      title: 'Secure Trading',
      description: 'Bank-level controls, institutional-grade risk management, and compliance workflows.',
      icon: Shield,
    },
    {
      title: 'Real-time Analytics',
      description: 'Live portfolio monitoring, performance attribution, and risk dashboards.',
      icon: BarChart3,
    },
    {
      title: 'AI Insights',
      description: 'Predictive signals, anomaly detection, and automated strategy suggestions.',
      icon: Zap,
    },
  ];

  const trainingModules = [
    {
      title: 'Platform Overview',
      content: 'Learn the layout of dashboards, trading workspaces, and notification center.',
    },
    {
      title: 'Portfolio Intelligence',
      content: 'Understand allocation analytics, correlation maps, and stress testing workflows.',
    },
    {
      title: 'AI Automation',
      content: 'Configure institutional bots, backtesting engines, and execution rulebooks.',
    },
  ];

  const showTraining = mode === 'training' || !isAuthenticated;

  return (
    <div className="min-h-screen bg-primary-bg pt-24 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-10"
      >
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            Blommy Institutional Trading Suite
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Master the platform before you connect real capital. Follow the guided training to unlock
            full access, then sign in to begin operating in the live environment.
          </p>
          {showTraining && (
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={goToTraining}
                className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-accent-hover transition"
              >
                <PlayCircle className="w-5 h-5" />
                Start Training Journey
              </button>
              <button
                onClick={goToLogin}
                className="flex items-center gap-2 border border-accent text-accent px-5 py-3 rounded-lg text-sm font-semibold hover:bg-accent/10 transition"
              >
                <ArrowRight className="w-5 h-5" />
                Sign In to Platform
              </button>
            </div>
          )}
        </header>

        {showTraining && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainingModules.map((module) => (
              <div key={module.title} className="bg-card-bg rounded-xl card-elevation p-6 text-left space-y-3">
                <h3 className="text-xl font-semibold text-white">{module.title}</h3>
                <p className="text-sm text-text-secondary">{module.content}</p>
                <button
                  className="text-accent text-sm font-semibold inline-flex items-center gap-1 hover:text-accent-hover"
                >
                  View lessons <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-card-bg rounded-xl card-elevation p-6 text-left space-y-3">
              <feature.icon className="w-8 h-8 text-accent" />
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </section>

        {!showTraining && (
          <div className="text-center">
            <button
              onClick={goToTraining}
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover"
            >
              Explore the training program <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WelcomePage;
