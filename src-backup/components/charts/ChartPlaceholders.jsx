import React from 'react';

const Card = ({ title, children }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-white font-bold mb-2">{title}</h3>
        {children}
    </div>
);
