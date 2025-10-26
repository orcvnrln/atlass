import React, { useState, useEffect } from 'react';

const JournalEntryForm = ({ onAddEntry, entryToEdit, onUpdateEntry, onCancelEdit }) => {
  const [asset, setAsset] = useState('');
  const [strategy, setStrategy] = useState('');
  const [notes, setNotes] = useState('');
  const isEditMode = !!entryToEdit;

  useEffect(() => {
    if (isEditMode) {
      setAsset(entryToEdit.asset);
      setStrategy(entryToEdit.strategy);
      setNotes(entryToEdit.notes);
    } else {
      setAsset('');
      setStrategy('');
      setNotes('');
    }
  }, [entryToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!asset.trim() || !notes.trim()) return;
    
    const entryData = { asset, strategy, notes };

    if (isEditMode) {
      onUpdateEntry(entryToEdit.id, entryData);
    } else {
      onAddEntry({ type: 'manual', ...entryData });
    }
    
    setAsset('');
    setStrategy('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-card-bg rounded-xl card-elevation border border-border-on-card space-y-4">
      <h2 className="text-xl font-bold text-text-on-card-primary mb-2">{isEditMode ? 'Edit Entry' : 'New Journal Entry'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          className="w-full p-2 bg-primary-bg border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
          placeholder="Asset (e.g., AAPL, EUR/USD)"
        />
        <input
          type="text"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="w-full p-2 bg-primary-bg border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
          placeholder="Strategy / Thesis"
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-2 bg-primary-bg border border-border-color rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
        placeholder="Describe your trade, your thesis, and the outcome..."
        rows="4"
      ></textarea>
      <div className="flex gap-4">
        <button type="submit" className="w-full mt-2 bg-accent text-white py-2 px-4 rounded-md hover:bg-accent/90 transition-colors">
          {isEditMode ? 'Update Entry' : 'Add Entry'}
        </button>
        {isEditMode && (
          <button type="button" onClick={onCancelEdit} className="w-full mt-2 bg-primary-bg text-text-secondary py-2 px-4 rounded-md hover:bg-white/10 transition-colors">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default JournalEntryForm;
