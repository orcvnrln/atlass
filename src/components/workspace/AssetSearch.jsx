import React, { useState } from 'react';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';

const SkeletonLoader = () => (
    <div className="absolute inset-0 bg-gray-800 animate-pulse" />
);

const AssetSearch = ({ onSelectAsset }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Simulate loading
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);
    
    // Dummy asset data - expanded for searchability
    const assets = [
        { value: 'EUR/USD', label: 'EUR/USD' },
        { value: 'BTC/USD', label: 'BTC/USD' },
        { value: 'AAPL', label: 'Apple Inc.' },
        { value: 'GOOGL', label: 'Alphabet Inc.' },
        { value: 'TSLA', label: 'Tesla Inc.' },
    ];

    const filteredAssets = assets.filter(asset =>
        asset.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#1E1E1E',
            borderColor: '#3A3A3A',
            color: 'white',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#1E1E1E',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#3A3A3A' : '#1E1E1E',
            color: 'white',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        }),
    };

    return (
        <div className="bg-card-bg p-4 rounded-lg w-full relative">
            <AnimatePresence>
                {isLoading && <SkeletonLoader />}
            </AnimatePresence>
            <h3 className="text-white font-bold mb-4">Select Asset</h3>
            <Select
                options={filteredAssets}
                onChange={(option) => onSelectAsset(option.value)}
                onInputChange={(value) => setSearchTerm(value)}
                styles={customStyles}
                placeholder="Search for an asset..."
            />
        </div>
    );
};

export default AssetSearch;
