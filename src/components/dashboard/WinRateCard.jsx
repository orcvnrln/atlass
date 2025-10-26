import React from 'react';
import Card from './Card';

const WinRateCard = ({ value }) => {
  return (
    <Card title="Win Rate">
      <div className="flex flex-col h-full">
        <div className="text-3xl font-bold text-white">{value}%</div>
        <div className="flex-grow flex items-end">
            <div className="w-full bg-border-color rounded-full h-2.5">
                <div className="bg-positive h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default WinRateCard;
