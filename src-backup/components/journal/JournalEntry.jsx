import React from 'react';
import { FileText, Bot, Trash2, Edit } from 'lucide-react';
import { useJournal } from '@/context/JournalContext';

const ActionButtons = ({ entryId, onEdit }) => {
  const { deleteEntry } = useJournal();
  return (
    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {onEdit && (
        <button onClick={onEdit} className="p-1 hover:text-accent">
          <Edit size={14} />
        </button>
      )}
      <button onClick={() => deleteEntry(entryId)} className="p-1 hover:text-negative">
        <Trash2 size={14} />
      </button>
    </div>
  );
};

const AutoEntry = ({ entry }) => (
  <div className="bg-card-bg p-4 rounded-lg border border-border-color relative group">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center space-x-2">
        <Bot size={16} className="text-accent" />
        <span className={`font-bold text-lg ${entry.action === 'buy' ? 'text-positive' : 'text-negative'}`}>
          {entry.action.toUpperCase()} {entry.asset}
        </span>
      </div>
      <span className="text-xs text-text-secondary">{new Date(entry.date).toLocaleString()}</span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
      <div><span className="text-text-secondary">Amount:</span> {entry.amount}</div>
      <div><span className="text-text-secondary">Price:</span> {entry.price}</div>
      <div><span className="text-text-secondary">SL:</span> {entry.stopLoss || 'N/A'}</div>
      <div><span className="text-text-secondary">TP:</span> {entry.takeProfit || 'N/A'}</div>
    </div>
    <ActionButtons entryId={entry.id} />
  </div>
);

const ManualEntry = ({ entry, onEdit }) => (
  <div className="bg-card-bg p-4 rounded-lg border border-border-color relative group">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center space-x-2">
        <FileText size={16} className="text-text-secondary" />
        <span className="font-bold text-lg">{entry.asset}</span>
      </div>
      <span className="text-xs text-text-secondary">{new Date(entry.date).toLocaleString()}</span>
    </div>
    <p className="text-sm text-text-secondary mb-2">{entry.strategy}</p>
    <p className="text-base">{entry.notes}</p>
    <ActionButtons entryId={entry.id} onEdit={onEdit} />
  </div>
);

const JournalEntry = ({ entry, onEdit }) => {
  if (entry.type === 'auto') {
    return <AutoEntry entry={entry} />;
  }
  return <ManualEntry entry={entry} onEdit={() => onEdit(entry)} />;
};

export default JournalEntry;
