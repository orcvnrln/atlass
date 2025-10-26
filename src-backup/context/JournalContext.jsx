import React, { createContext, useState, useContext, useEffect } from 'react';

const JournalContext = createContext();

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useState(() => {
    try {
      const localData = localStorage.getItem('journalEntries');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse journal entries from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('journalEntries', JSON.stringify(entries));
    } catch (error) {
      console.error("Could not save journal entries to localStorage", error);
    }
  }, [entries]);

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
