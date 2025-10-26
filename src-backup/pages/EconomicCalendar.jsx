import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Filter, ChevronDown, Zap } from 'lucide-react';
import { mockEvents } from '@/data/calendarData';

const ImpactLabel = ({ impact }) => {
    const impactConfig = {
      1: { label: 'Low', className: 'bg-green-500/20 text-green-400' },
      2: { label: 'Medium', className: 'bg-yellow-500/20 text-yellow-400' },
      3: { label: 'High', className: 'bg-red-500/20 text-red-400' },
    };
    const { label, className } = impactConfig[impact] || impactConfig[1];
    return (
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${className}`}>
        {label}
      </span>
    );
};

const EconomicCalendar = () => {
    const [currencyFilter, setCurrencyFilter] = useState('all');
    const [impactFilter, setImpactFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
    const [expandedRow, setExpandedRow] = useState(null);

    const currencies = useMemo(() => ['all', ...new Set(mockEvents.map(e => e.currency))], [mockEvents]);
    
    const sortedAndFilteredEvents = useMemo(() => {
        let sortableEvents = [...mockEvents];

        if (currencyFilter !== 'all') {
            sortableEvents = sortableEvents.filter(event => event.currency === currencyFilter);
        }

        if (impactFilter !== 'all') {
            sortableEvents = sortableEvents.filter(event => event.impact.toString() === impactFilter);
        }

        sortableEvents.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        return sortableEvents;
    }, [mockEvents, currencyFilter, impactFilter, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleRowClick = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>Economic Calendar - Blommy</title>
        <meta name="description" content="AI-enhanced economic events calendar." />
      </Helmet>
      <div className="max-w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-1">Economic Calendar</h1>
          <p className="text-md text-text-secondary">Track market-moving events with AI impact analysis</p>
        </motion.div>
        
        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex space-x-4 mb-6">
            <div>
                <label htmlFor="currencyFilter" className="block text-sm font-medium text-text-secondary mb-1">Currency</label>
                <select id="currencyFilter" onChange={(e) => setCurrencyFilter(e.target.value)} value={currencyFilter} className="bg-primary-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-accent focus:border-accent">
                    {currencies.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="impactFilter" className="block text-sm font-medium text-text-secondary mb-1">Impact</label>
                <select id="impactFilter" onChange={(e) => setImpactFilter(e.target.value)} value={impactFilter} className="bg-primary-bg border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-accent focus:border-accent">
                    <option value="all">All</option>
                    <option value="3">High</option>
                    <option value="2">Medium</option>
                    <option value="1">Low</option>
                </select>
            </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="bg-card-bg rounded-xl card-elevation overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-primary-bg text-text-secondary uppercase">
                <tr>
                    <th className="p-3 cursor-pointer" onClick={() => requestSort('date')} title="Sort by Date">Date</th>
                    <th className="p-3 cursor-pointer" onClick={() => requestSort('time')} title="Sort by Time">Time</th>
                    <th className="p-3 cursor-pointer" onClick={() => requestSort('currency')} title="Sort by Currency">Currency</th>
                    <th className="p-3">Event</th>
                    <th className="p-3 cursor-pointer" onClick={() => requestSort('impact')} title="Sort by Impact">Impact</th>
                    <th className="p-3" title="The actual reported value">Actual</th>
                    <th className="p-3" title="The consensus forecast value">Forecast</th>
                    <th className="p-3" title="The previously reported value">Previous</th>
                </tr>
                </thead>
                <tbody>
                {sortedAndFilteredEvents.map((event, index) => (
                    <React.Fragment key={index}>
                        <tr onClick={() => handleRowClick(index)} className="border-t border-border-color hover:bg-accent/10 cursor-pointer">
                            <td className="p-3 font-mono">{event.date}</td>
                            <td className="p-3 font-mono">{event.time}</td>
                            <td className="p-3 font-bold">{event.currency}</td>
                            <td className="p-3 text-text-primary">{event.event}</td>
                            <td className="p-3"><ImpactLabel impact={event.impact} /></td>
                            <td className="p-3 font-mono">{event.actual}</td>
                            <td className="p-3 font-mono">{event.forecast}</td>
                            <td className="p-3 font-mono">{event.previous}</td>
                        </tr>
                        {expandedRow === index && (
                            <tr className="bg-primary-bg border-t border-border-color">
                                <td colSpan="8" className="p-4">
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                                        <div className="flex items-start text-sm text-text-secondary">
                                            <Zap className="mr-3 text-accent flex-shrink-0" size={18} />
                                            <div>
                                                <p className='font-bold text-accent mb-1'>AI Asset Reaction Forecast</p>
                                                <p className='text-text-primary'>{event.assetReaction}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EconomicCalendar;