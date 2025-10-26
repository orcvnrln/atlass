import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, User, Menu, X
} from 'lucide-react';
import { mainNavItems, marketNavItems } from '@/data/navData';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const NavItem = ({ item, onClick }) => {
    const isActive = location.pathname === item.path;
    return (
        <NavLink
            key={item.name}
            to={item.path}
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-lg text-md font-medium transition-all ${isActive ? 'bg-accent/20 text-text-on-card-primary' : 'text-text-on-card-secondary hover:text-text-on-card-primary'}`}
        >
            <item.icon className="w-5 h-5" />
            {item.name}
        </NavLink>
    )
  }

  return (
    <>
      <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-primary-bg/80 backdrop-blur-sm border-b border-border-color flex items-center justify-between px-4 lg:px-6 z-50">
        <div className="flex items-center gap-4">
           {/* Mobile Menu Toggle */}
          <button className="p-2 rounded-full hover:bg-accent/20 lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5 text-text-primary" /> : <Menu className="w-5 h-5 text-text-primary" />}
          </button>
          {/* This h1 is hidden on mobile, so it will only show on desktop next to the sidebar */}
          <h1 className="text-xl font-bold text-text-primary hidden md:block">
            {selectedAsset ? (
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedAsset.flag1}</span>
                <span className="text-lg">{selectedAsset.flag2}</span>
                <span>{selectedAsset.symbol}</span>
              </div>
            ) : (
              'Dashboard'
            )}
          </h1>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {marketNavItems.map((category) => {
            const isActive = location.pathname.startsWith(category.path);
            return (
              <button
                key={category.name}
                onClick={() => navigate(category.path)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:bg-accent/20 ${
                  isActive ? 'text-text-primary bg-accent/10' : 'text-text-secondary'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-card-bg border border-border-on-card rounded-md pl-9 pr-3 py-1.5 text-sm w-48 focus:ring-2 focus:ring-accent focus:outline-none text-text-on-card-primary placeholder:text-text-on-card-secondary"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-accent/20 hidden md:block">
            <User className="w-5 h-5 text-text-primary" />
          </button>
        </div>
      </header>

      {/* Mobile Menu - This is a drawer that appears from the side */}
      <div 
        className={`fixed top-0 left-0 w-64 h-full bg-card-bg shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
          <div className="flex items-center justify-between p-4 border-b border-border-on-card">
              <h1 className="text-xl font-bold text-text-on-card-primary">Blommy</h1>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-text-on-card-secondary"/>
              </button>
          </div>
          <nav className="flex flex-col gap-4 p-4">
            <div>
              <h2 className="px-3 mb-2 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">Main</h2>
              {mainNavItems.map((item) => <NavItem key={item.path} item={item} onClick={() => setIsMobileMenuOpen(false)} />)}
            </div>
            <div>
              <h2 className="px-3 mb-2 text-xs font-semibold tracking-wider text-text-on-card-secondary uppercase">Markets</h2>
              {marketNavItems.map((item) => <NavItem key={item.path} item={item} onClick={() => setIsMobileMenuOpen(false)} />)}
            </div>
          </nav>
        </div>
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </>
  );
};

export default Navbar;