import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Zap } from 'lucide-react';

const events = [
  {
    time: '08:30 AM',
    eventName: 'US Core CPI m/m',
    impact: 'High',
    aiAnalysis: 'Higher than expected inflation could lead to a more hawkish Fed stance, potentially strengthening the USD.'
  },
  {
    time: '10:00 AM',
    eventName: 'ECB President Lagarde Speaks',
    impact: 'Medium',
    aiAnalysis: 'Market volatility is expected for EUR pairs. Watch for clues on future monetary policy.'
  },
  {
    time: '02:00 PM',
    eventName: 'FOMC Meeting Minutes',
    impact: 'High',
    aiAnalysis: 'Traders will be scrutinizing the text for hints on the timing of rate cuts.'
  },
];

const ImpactLabel = ({ impact }) => {
  const impactColor = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
  };
  return (
    <span className={`text-xs font-bold mr-2 px-2.5 py-0.5 rounded-full text-white ${impactColor[impact]}`}>
      {impact}
    </span>
  );
};

const EconomicCalendar = () => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-text-on-card-primary mb-4 flex items-center">
        <Calendar className="mr-2" /> Economic Calendar
      </h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={index}
            className="bg-background-accent p-4 rounded-lg border border-border-on-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="font-mono text-text-on-card-secondary mr-4">{event.time}</span>
                <ImpactLabel impact={event.impact} />
                <span className="font-semibold text-text-on-card-primary">{event.eventName}</span>
              </div>
            </div>
            <div className="flex items-start text-sm text-text-on-card-secondary pl-16">
                <Zap className="mr-2 text-primary flex-shrink-0" size={16} />
                <p className='italic'><span className='font-bold text-primary'>AI Insight:</span> {event.aiAnalysis}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EconomicCalendar;
