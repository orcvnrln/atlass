import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Folder, Plus, X, Edit3, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FavoriteButton from './FavoriteButton';

const FavoritesManager = ({ 
  favorites, 
  onToggleFavorite, 
  watchlist, 
  onNavigateToAsset 
}) => {
  const [favoriteGroups, setFavoriteGroups] = useState(() => {
    const saved = localStorage.getItem('favorite-groups');
    return saved ? JSON.parse(saved) : {
      'default': { name: 'My Favorites', symbols: favorites }
    };
  });
  
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const saveFavoriteGroups = (groups) => {
    setFavoriteGroups(groups);
    localStorage.setItem('favorite-groups', JSON.stringify(groups));
  };

  const createGroup = () => {
    if (!newGroupName.trim()) return;
    
    const groupId = Date.now().toString();
    const updatedGroups = {
      ...favoriteGroups,
      [groupId]: {
        name: newGroupName.trim(),
        symbols: []
      }
    };
    
    saveFavoriteGroups(updatedGroups);
    setNewGroupName('');
    setIsCreatingGroup(false);
  };

  const deleteGroup = (groupId) => {
    if (groupId === 'default') return; // Can't delete default group
    
    const updatedGroups = { ...favoriteGroups };
    delete updatedGroups[groupId];
    saveFavoriteGroups(updatedGroups);
  };

  const renameGroup = (groupId, newName) => {
    if (!newName.trim()) return;
    
    const updatedGroups = {
      ...favoriteGroups,
      [groupId]: {
        ...favoriteGroups[groupId],
        name: newName.trim()
      }
    };
    
    saveFavoriteGroups(updatedGroups);
    setEditingGroup(null);
  };

  const addToGroup = (groupId, symbol) => {
    const updatedGroups = {
      ...favoriteGroups,
      [groupId]: {
        ...favoriteGroups[groupId],
        symbols: [...(favoriteGroups[groupId].symbols || []), symbol]
      }
    };
    
    saveFavoriteGroups(updatedGroups);
  };

  const removeFromGroup = (groupId, symbol) => {
    const updatedGroups = {
      ...favoriteGroups,
      [groupId]: {
        ...favoriteGroups[groupId],
        symbols: (favoriteGroups[groupId].symbols || []).filter(s => s !== symbol)
      }
    };
    
    saveFavoriteGroups(updatedGroups);
  };

  const getAssetFromWatchlist = (symbol) => {
    return watchlist.find(asset => asset.symbol === symbol);
  };

  const filteredGroups = Object.entries(favoriteGroups).filter(([_, group]) => {
    if (!searchTerm) return true;
    return group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (group.symbols || []).some(symbol => 
             symbol.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary-bg border border-border-on-card rounded-lg text-text-primary focus:border-accent-orange focus:outline-none"
          />
        </div>
        <Button
          onClick={() => setIsCreatingGroup(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          New Group
        </Button>
      </div>

      {/* Create New Group Modal */}
      <AnimatePresence>
        {isCreatingGroup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card-bg rounded-lg p-4 border border-border-on-card"
          >
            <h4 className="text-lg font-semibold text-text-primary mb-3">Create New Group</h4>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Group name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createGroup()}
                className="flex-1 p-2 bg-primary-bg border border-border-on-card rounded text-text-primary focus:border-accent-orange focus:outline-none"
                autoFocus
              />
              <Button onClick={createGroup} size="sm">Create</Button>
              <Button 
                onClick={() => {
                  setIsCreatingGroup(false);
                  setNewGroupName('');
                }} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorite Groups */}
      <div className="space-y-4">
        {filteredGroups.map(([groupId, group]) => (
          <motion.div
            key={groupId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card-bg rounded-lg border border-border-on-card overflow-hidden"
          >
            {/* Group Header */}
            <div className="p-4 border-b border-border-on-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Folder size={18} className="text-accent-orange" />
                  {editingGroup === groupId ? (
                    <input
                      type="text"
                      defaultValue={group.name}
                      onBlur={(e) => renameGroup(groupId, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          renameGroup(groupId, e.target.value);
                        }
                      }}
                      className="bg-primary-bg border border-border-on-card rounded px-2 py-1 text-text-primary focus:border-accent-orange focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-text-primary">{group.name}</h3>
                  )}
                  <span className="text-sm text-text-secondary">
                    ({(group.symbols || []).length} items)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingGroup(editingGroup === groupId ? null : groupId)}
                    className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  {groupId !== 'default' && (
                    <button
                      onClick={() => deleteGroup(groupId)}
                      className="p-1 text-text-secondary hover:text-accent-red transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Group Content */}
            <div className="p-4">
              {(group.symbols || []).length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  No favorites in this group
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(group.symbols || []).map((symbol) => {
                    const asset = getAssetFromWatchlist(symbol);
                    if (!asset) return null;

                    return (
                      <motion.div
                        key={symbol}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary-bg rounded-lg p-3 border border-border-on-card hover:border-accent-orange/50 transition-colors cursor-pointer"
                        onClick={() => onNavigateToAsset(asset)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-text-primary">{asset.symbol}</span>
                          <div className="flex items-center gap-1">
                            <FavoriteButton
                              symbol={symbol}
                              isFavorite={true}
                              onToggle={() => {
                                onToggleFavorite(symbol);
                                removeFromGroup(groupId, symbol);
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromGroup(groupId, symbol);
                              }}
                              className="p-1 text-text-secondary hover:text-accent-red transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-text-primary">
                            ${asset.price}
                          </span>
                          <span className={`text-sm font-medium ${
                            asset.change >= 0 ? 'text-accent-green' : 'text-accent-red'
                          }`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          No favorite groups found
        </div>
      )}
    </div>
  );
};

export default FavoritesManager;
