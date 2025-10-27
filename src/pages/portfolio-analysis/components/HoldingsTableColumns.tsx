import { createColumnHelper } from '@tanstack/react-table';
import { Holding } from '../utils/mockData';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, ArrowUpRight, AlertCircle } from 'lucide-react';

const columnHelper = createColumnHelper<Holding>();

export const columns = [
  columnHelper.accessor('name', {
    header: 'Asset',
    cell: info => (
      <div className="flex items-center gap-2">
        {/* Placeholder for icon */}
        <div className="w-6 h-6 bg-gray-700 rounded-full flex-shrink-0"></div>
        <div>
          <p className="font-bold text-text-primary">{info.row.original.symbol}</p>
          <p className="text-xs text-text-secondary truncate">{info.getValue()}</p>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('assetClass', {
    header: 'Asset Class',
    cell: info => <span className="text-xs font-semibold bg-gray-700/50 text-text-secondary px-2 py-1 rounded-full">{info.getValue()}</span>,
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
    cell: info => <span>{info.getValue().toLocaleString()} {info.row.original.symbol}</span>,
  }),
  columnHelper.accessor('entryPrice', {
    header: 'Entry Price',
    cell: info => <span>{formatCurrency(info.getValue())}</span>,
  }),
  columnHelper.accessor('currentPrice', {
    header: 'Current Price',
    cell: info => (
      <div className="flex items-center gap-1 text-green-400">
        <span>{formatCurrency(info.getValue())}</span>
        <ArrowUpRight size={14} />
      </div>
    ),
  }),
  columnHelper.accessor('marketValue', {
    header: 'Market Value',
    cell: info => <span className="font-bold">{formatCurrency(info.getValue())}</span>,
  }),
  columnHelper.accessor('portfolioPercentage', {
    header: '% of Portfolio',
    cell: info => (
      <div className="flex items-center gap-2">
        <span>{formatPercentage(info.getValue())}</span>
        <div className="w-16 h-2 bg-gray-700 rounded-full">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${info.getValue()}%` }}></div>
        </div>
        {info.getValue() > 20 && <AlertCircle size={14} className="text-yellow-500" />}
      </div>
    ),
  }),
  columnHelper.accessor('totalPnl', {
    header: 'Total P&L',
    cell: info => (
      <div className={`flex flex-col ${info.getValue() > 0 ? 'text-green-400' : 'text-red-400'}`}>
        <span>{formatCurrency(info.getValue())}</span>
        <span className="text-xs">{formatPercentage(info.row.original.totalPnlPercent)}</span>
      </div>
    ),
  }),
  columnHelper.accessor('todayChange', {
    header: "Today's P&L",
    cell: info => (
      <div className={`flex flex-col ${info.getValue() > 0 ? 'text-green-400' : 'text-red-400'}`}>
        <span>{formatCurrency(info.getValue())}</span>
        <span className="text-xs">{formatPercentage(info.row.original.todayChangePercent)}</span>
      </div>
    ),
  }),
  columnHelper.accessor('riskContribution', {
    header: 'Risk Contrib.',
    cell: info => <span>{formatPercentage(info.getValue())}</span>,
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => (
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" className="h-8">Trade</Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal size={16} />
        </Button>
      </div>
    ),
  }),
];
