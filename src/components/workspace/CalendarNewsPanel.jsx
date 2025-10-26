import React, { useState } from 'react';
import { Calendar, Newspaper } from 'lucide-react';
import EconomicCalendar from '@/components/dashboard/EconomicCalendar';
import MiniNewsFeed from '@/components/workspace/MiniNewsFeed';

const CalendarNewsPanel = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="bg-card-bg border border-border-on-card rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {activeTab === 'calendar' ? <Calendar size={18} className="text-amber-300" /> : <Newspaper size={18} className="text-blue-300" />}
          {activeTab === 'calendar' ? 'Economic Calendar' : 'News Hub'}
        </h3>
        <div className="flex items-center bg-primary-bg p-1 rounded-md">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
              activeTab === 'calendar' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
              activeTab === 'news' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            News
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'calendar' ? <EconomicCalendar /> : <MiniNewsFeed />}
      </div>
    </div>
  );
};

export default CalendarNewsPanel;


