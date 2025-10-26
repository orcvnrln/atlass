import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Settings, Home, Wallet, Star, Newspaper, CalendarDays, BrainCircuit, Link2, Book, Activity, Layers2, Bot, BarChart3, TrendingUp, Zap } from 'lucide-react';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';
import { motion } from 'framer-motion';
import { marketNavItems } from '@/data/navData';

const NavItem = ({ item, isActive }) => {
  const location = useLocation();
  const active = isActive !== undefined ? isActive : false;
  
  return (
    <NavLink
      to={item.path}
      state={item.state}
      end={item.path === '/'}
      className={() =>
        `flex items-center p-3 rounded-lg transition-all duration-200 text-sm font-medium ${
          active 
            ? 'bg-accent text-white shadow-lg' 
            : 'text-text-on-card-secondary hover:bg-white/10 hover:text-text-on-card-primary'
        }`
      }
    >
      <item.icon className="w-5 h-5 mr-3" />
      {item.name}
    </NavLink>
  );
};

const Sidebar = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: -100, y: -100 });
  const navRef = React.useRef(null);
  const location = useLocation();


  const handleMouseMove = (e) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: -100, y: -100 });
  };

  const mainNavItems = [
    { path: '/', icon: Home, name: 'Dashboard' },
    { path: '/workspace/institutional', icon: Layers2, name: 'Institutional Workspace' },
    { path: '/derivatives', icon: Activity, name: 'Derivatives' },
    { path: '/watchlist', icon: Star, name: 'Watchlist' },
    { path: '/news', icon: Newspaper, name: 'News Hub' },
  ];

  const marketNavList = [
    {
      path: '/markets',
      icon: TrendingUp,
      name: 'Markets',
    }
  ];

      const aiSuiteNavItems = [
        { path: '/portfolio-analysis', icon: Wallet, name: 'Portfolio Analysis' },
        { path: '/correlation-matrix', icon: Link2, name: 'Correlation Matrix' },
        { path: '/economic-calendar', icon: CalendarDays, name: 'Economic Calendar' },
        { path: '/ai-copilot', icon: BrainCircuit, name: 'AI Co-Pilot' },
        { path: '/ai-trading-bot', icon: Bot, name: 'AI Trading Bot' },
        { path: '/institutional-bot', icon: Zap, name: 'Institutional Bot' },
        { path: '/trade-journal', icon: Book, name: 'Trade Journal' },
        { path: '/backtesting', icon: BarChart3, name: 'Backtesting Engine' },
        { path: '/paper-trading', icon: TrendingUp, name: 'Paper Trading' },
      ];

  const isActive = (path) => location.pathname.startsWith(path);


  return (
    <div className="w-64 h-screen bg-card-bg text-text-on-card-primary flex-col fixed border-r border-border-color pt-16 hidden lg:flex shadow-xl">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border-on-card">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-text-on-card-primary">Blommy</h1>
           <ThemeSwitcher />
        </div>
      </div>

      <nav 
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin relative"
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.05), transparent 80%)`,
          }}
          animate={{ x: mousePosition.x - 250, y: mousePosition.y - 250, width: 500, height: 500 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
        />
        
        {/* Main Navigation */}
        <div>
          <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">Main</h2>
          <div className="space-y-1">
            {mainNavItems.map((item) => <NavItem key={item.path} item={item} isActive={isActive(item.path)} />)}
          </div>
        </div>

        <div>
          <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">Markets</h2>
          <div className="space-y-1">
            {marketNavList.map((item) => <NavItem key={item.path} item={item} isActive={isActive(item.path)} />)}
          </div>
        </div>

        {/* AI Suite Navigation */}
        <div>
            <h2 className="px-3 mb-3 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">AI Suite</h2>
            <div className="space-y-1">
                {aiSuiteNavItems.map((item) => <NavItem key={item.path} item={item} isActive={isActive(item.path)} />)}
            </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border-on-card">
        <NavItem item={{ path: '/settings', icon: Settings, name: 'Settings' }} />
      </div>
    </div>
  );
};

export default Sidebar;
