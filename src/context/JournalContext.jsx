import React, { createContext, useContext } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

const JournalContext = createContext();

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useLocalStorage('journalEntries', []);

  const addEntry = (entry) => {
    const newEntry = { ...entry, id: Date.now(), date: new Date().toISOString() };
    setEntries(prevEntries => [newEntry, ...prevEntries]);
  };

  const deleteEntry = (id) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const updateEntry = (id, updatedEntry) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, deleteEntry, updateEntry }}>
      {children}
    </JournalContext.Provider>
  );
};
