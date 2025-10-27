import React, { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, User, Menu, X
} from 'lucide-react';
import { mainNavItems, marketNavItems, flattenMarketAssets, marketAssets } from '@/data/navData';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [assetSearch, setAssetSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredAssets = useMemo(() => {
    const query = assetSearch.trim().toLowerCase();
    if (!query) return flattenMarketAssets.slice(0, 6);
    return flattenMarketAssets.filter(asset =>
      asset.symbol.toLowerCase().includes(query) ||
      asset.name.toLowerCase().includes(query) ||
      (asset.displaySymbol && asset.displaySymbol.toLowerCase().includes(query))
    ).slice(0, 8);
  }, [assetSearch]);

  const handleAssetSelect = (asset) => {
    setAssetSearch('');
    setIsSearchFocused(false);
    navigate('/workspace/institutional', { state: { symbol: asset.symbol } });
  };

  const NavItem = ({ item, onClick }) => {
    const isActive = location.pathname === item.path;
    return (
        <NavLink
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
      <header className="fixed top-0 left-0 lg:left-[257px] right-0 h-16 bg-primary-bg/80 backdrop-blur-sm border-b border-border-color flex items-center justify-between px-4 lg:px-6 z-50">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            className="p-2 rounded-full hover:bg-accent/20 lg:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-text-primary" /> : <Menu className="w-5 h-5 text-text-primary" />}
          </button>
          {/* This h1 is hidden on mobile, so it will only show on desktop next to the sidebar */}
          <h1 className="text-xl font-bold text-text-primary hidden md:block">
            Institutional Workspace
          </h1>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {marketNavItems.map((category) => {
            const isActive = location.pathname === `/markets/${category.slug}`;
            return (
              <button
                key={category.name}
                onClick={() => navigate(`/markets/${category.slug}`, { state: { view: 'heatmap', group: category.name } })}
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
          <div className="relative hidden md:block min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={assetSearch}
              onChange={(e) => setAssetSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 120)}
              placeholder="Search assets..."
              className="bg-card-bg border border-border-on-card rounded-md pl-9 pr-3 py-1.5 text-sm w-full focus:ring-2 focus:ring-accent focus:outline-none text-text-on-card-primary placeholder:text-text-on-card-secondary"
            />
            {isSearchFocused && filteredAssets.length > 0 && (
              <div 
                role="listbox" 
                aria-label="Search results"
                className="absolute z-50 mt-2 w-full bg-card-bg border border-border-on-card rounded-lg shadow-lg overflow-hidden"
              >
                <div className="max-h-72 overflow-y-auto">
                  {filteredAssets.map(asset => (
                    <button
                      key={asset.symbol}
                      role="option"
                      tabIndex={0}
                      onMouseDown={() => handleAssetSelect(asset)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAssetSelect(asset);
                        }
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-accent/10 focus:bg-accent/10 focus:outline-none transition-colors"
                    >
                      <span className="text-lg">{asset.flag1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text-on-card-primary">
                          {asset.displaySymbol || asset.symbol}
                        </p>
                        <p className="text-xs text-text-on-card-secondary">
                          {asset.name}
                        </p>
                      </div>
                      <span className="text-[11px] text-text-on-card-secondary uppercase tracking-wide">
                        {asset.category}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="px-3 py-2 text-[11px] text-text-on-card-secondary bg-card-bg/80 border-t border-border-on-card">
                  Type to filter {flattenMarketAssets.length} assets • Enter to confirm
                </div>
              </div>
            )}
          </div>
          <button 
            className="p-2 rounded-full hover:bg-accent/20 hidden md:block"
            aria-label="User profile"
          >
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
              {marketNavItems.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => {
                    navigate(`/markets/${item.slug}`, { state: { view: 'heatmap', group: item.name } });
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg text-md font-medium transition-all text-text-on-card-secondary hover:text-text-on-card-primary w-full text-left"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </>
  );
};

export default Navbar;