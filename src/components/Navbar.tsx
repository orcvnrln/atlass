import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, User, Menu } from 'lucide-react';

interface NavbarProps {
  onWatchlistToggle: () => void;
  isWatchlistOpen: boolean;
}

const Navbar = ({ onWatchlistToggle, isWatchlistOpen }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('Dashboard');

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Markets', path: '/markets/major' },
    { name: 'Watchlist', path: '/watchlist', hasDropdown: true },
    { name: 'AI Insights', path: '/ai-copilot' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Settings', path: '/settings' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveItem(item.name);
    if (item.name === 'Watchlist') {
      onWatchlistToggle();
    }
    navigate(item.path);
  };

  return (
    <nav className="bg-card-bg border-b border-border-color sticky top-0 z-50 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-accent">
                Blommy
              </h1>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                    location.pathname === item.path
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-accent/10'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isWatchlistOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                <span className="sr-only">View notifications</span>
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
