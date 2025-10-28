import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Wallet,
  LineChart,
  Newspaper,
  Calendar,
  Settings,
  BookOpen,
  Bot,
  BrainCircuit,
  Network,
  CircuitBoard,
  Database,
  HelpCircle,
  BarChart2,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { motion } from 'framer-motion';

const NavItem = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      end={item.exact}
      className={({ isActive }) => `
        flex items-center p-3 rounded-lg transition-all duration-200 text-sm font-medium
        ${isActive 
          ? 'bg-accent text-white shadow-lg' 
          : 'text-text-on-card-secondary hover:bg-white/10 hover:text-text-on-card-primary'
        }
      `}
    >
      <item.icon className="w-5 h-5 mr-3" />
      <span>{item.label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: -100, y: -100 });
  const navRef = React.useRef(null);

  const handleMouseMove = (e) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: -100, y: -100 });
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', exact: true },
    { path: '/portfolio', icon: Wallet, label: 'Portfolio', exact: true },
    { path: '/watchlist', icon: LineChart, label: 'Watchlist', exact: true },
    { path: '/markets', icon: BarChart2, label: 'Markets', exact: true },
    { path: '/news', icon: Newspaper, label: 'News Hub', exact: true },
    { path: '/calendar', icon: Calendar, label: 'Economic Calendar', exact: true },
    { path: '/trade-journal', icon: BookOpen, label: 'Trade Journal', exact: true },
    { path: '/market-scanner', icon: Target, label: 'Market Scanner', exact: true },
    { path: '/dark-pool', icon: Database, label: 'Dark Pool', exact: true },
    { path: '/derivatives', icon: Network, label: 'Derivatives', exact: true },
    { path: '/heatmap', icon: CircuitBoard, label: 'Market Heatmap', exact: true },
    { path: '/ai-suite', icon: BrainCircuit, label: 'AI Suite', exact: true },
    { path: '/ai-copilot', icon: Bot, label: 'AI Copilot', exact: true },
    { path: '/ai-trading-bot', icon: Bot, label: 'AI Trading Bot', exact: true },
    { path: '/portfolio-analysis', icon: TrendingUp, label: 'Portfolio Analysis', exact: true },
    { path: '/correlation-matrix', icon: Network, label: 'Correlation Matrix', exact: true },
    { path: '/institutional-bot', icon: Zap, label: 'Institutional Bot', exact: true },
    { path: '/backtesting', icon: LineChart, label: 'Backtesting', exact: true },
    { path: '/paper-trading', icon: TrendingUp, label: 'Paper Trading', exact: true },
    { path: '/settings', icon: Settings, label: 'Settings', exact: true },
    { path: '/help', icon: HelpCircle, label: 'Help & Support', exact: true },
  ];

  return (
    <div className="w-64 h-screen bg-card-bg/95 backdrop-blur-md text-text-on-card-primary flex-col fixed left-0 top-0 border-r border-border-color hidden lg:flex shadow-xl z-40">
      {/* Header */}
      <div className="px-4 py-6 border-b border-border-on-card bg-card-bg/100">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-text-on-card-primary">Blommy</h1>
           <ThemeSwitcher />
        </div>
      </div>

      <nav 
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin relative bg-card-bg/100"
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.02), transparent 70%)`,
          }}
          animate={{ x: mousePosition.x - 250, y: mousePosition.y - 250, width: 500, height: 500 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
        />
        
        {/* Main Navigation */}
        <div className="relative z-10">
          <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">Main</h2>
          <div className="space-y-1">
            {navItems.slice(0, 6).map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        </div>

        {/* Trading Tools */}
        <div className="relative z-10">
          <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">Trading Tools</h2>
          <div className="space-y-1">
            {navItems.slice(6, 11).map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        </div>

        {/* AI Suite */}
        <div className="relative z-10">
          <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">AI Suite</h2>
          <div className="space-y-1">
            {navItems.slice(11, 17).map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        </div>

        {/* Tools & Settings */}
        <div className="relative z-10">
          <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">Tools & Settings</h2>
          <div className="space-y-1">
            {navItems.slice(17).map((item) => <NavItem key={item.path} item={item} />)}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
