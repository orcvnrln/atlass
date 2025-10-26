import React, { useState } from 'react';
import JournalEntryForm from './JournalEntryForm';
import PerformanceCoach from './PerformanceCoach';
import { useJournal } from '@/context/JournalContext';
import JournalEntry from './JournalEntry';
import { useToast } from '@/components/ui/use-toast';

const TradeJournal = () => {
  const { entries, addEntry, updateEntry } = useJournal();
  const [entryToEdit, setEntryToEdit] = useState(null);
  const { toast } = useToast();

  const handleAddEntry = (entry) => {
    addEntry(entry);
    toast({
      title: "Entry Added",
      description: "Your new journal entry has been saved.",
    });
  };

  const handleUpdateEntry = (id, entry) => {
    updateEntry(id, entry);
    setEntryToEdit(null);
    toast({
      title: "Entry Updated",
      description: "Your journal entry has been successfully updated.",
    });
  };

  const handleEdit = (entry) => {
    setEntryToEdit(entry);
  };

  const handleCancelEdit = () => {
    setEntryToEdit(null);
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Trade Journal</h1>
        <div className="space-y-4">
          {entries.length > 0 ? (
            entries.map(entry => (
              <JournalEntry key={entry.id} entry={entry} onEdit={handleEdit} />
            ))
          ) : (
            <p className="text-text-secondary">No journal entries yet.</p>
          )}
        </div>
        <div className="mt-4">
          <JournalEntryForm
            onAddEntry={handleAddEntry}
            entryToEdit={entryToEdit}
            onUpdateEntry={handleUpdateEntry}
            onCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
      <div>
        <PerformanceCoach entries={entries} />
      </div>
    </div>
  );
};

export default TradeJournal;
