import React from 'react';
import { motion } from 'framer-motion';

const OrderBookRow = ({ price, size, type, maxTotal }) => {
    const depth = (size / maxTotal) * 100;
    const isBid = type === 'bid';

    return (
        <div className="relative flex justify-between items-center text-xs p-1">
            <motion.div 
                className={`absolute top-0 bottom-0 ${isBid ? 'left-0' : 'right-0'} ${isBid ? 'bg-green-800' : 'bg-red-800'}`}
                initial={{ width: 0 }}
                animate={{ width: `${depth}%` }}
                transition={{ duration: 0.3 }}
            />
            <span className={`z-10 font-mono ${isBid ? 'text-green-400' : 'text-red-400'}`}>
                {price}
            </span>
            <span className="z-10 font-mono">{size.toLocaleString()}</span>
        </div>
    );
};

export default OrderBookRow;
