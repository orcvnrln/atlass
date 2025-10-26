import React from 'react';
import { useJournal } from '@/context/JournalContext';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

const MiniJournal = () => {
    const { entries, addEntry } = useJournal();

    const handleQuickAdd = () => {
        addEntry({
            asset: 'EUR/USD',
            strategy: 'Breakout',
            thesis: 'Price broke key resistance after CPI data.',
            outcome: 'In Progress',
        });
    };

    return (
        <div className="bg-card-bg border border-border-on-card rounded-xl p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-300" /> Trade Journal & AI Mentor
            </h3>
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <Button onClick={handleQuickAdd} className="w-full">Add New Trade</Button>
                <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2">
                    {entries.slice(0, 5).map(entry => (
                        <div key={entry.id} className="text-xs p-2 rounded-md bg-primary-bg border border-border-color">
                            <p className="font-semibold text-text-primary">{entry.asset}: {entry.strategy}</p>
                            <p className="text-text-secondary truncate">{entry.thesis}</p>
                        </div>
                    ))}
                    {entries.length === 0 && <p className="text-xs text-text-secondary text-center py-4">No journal entries yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default MiniJournal;
