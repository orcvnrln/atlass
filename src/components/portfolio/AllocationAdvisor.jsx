import React, { useState } from 'react';
import Card from '@/components/dashboard/Card';
import { Slider } from "@/components/ui/slider.jsx"

const AllocationAdvisor = ({ data }) => {
    const [allocations, setAllocations] = useState(data);

    const handleSliderChange = (index, newValue) => {
        const newAllocations = [...allocations];
        newAllocations[index].value = newValue[0];
        setAllocations(newAllocations);
    };
    
    // Mock calculation for risk/return
    const projectedRisk = allocations.reduce((acc, a) => acc + a.value * a.risk, 0) / 100;
    const projectedReturn = allocations.reduce((acc, a) => acc + a.value * a.return, 0) / 100;

    return (
        <Card title="Scenario-Based Allocation Advisor" className="col-span-1 lg:col-span-2">
            <p className="text-sm text-text-secondary mb-4">
                Simulate how changes in your asset allocation might impact your portfolio's risk and return.
            </p>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    {allocations.map((alloc, index) => (
                        <div key={alloc.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-primary">{alloc.name}</span>
                                <span className="font-mono text-accent">{alloc.value}%</span>
                            </div>
                            <Slider defaultValue={[alloc.value]} max={100} step={1} onValueChange={(v) => handleSliderChange(index, v)} />
                        </div>
                    ))}
                </div>
                <div className="bg-primary-bg p-4 rounded-lg text-center flex flex-col justify-center">
                    <p className="text-sm text-text-secondary">Projected Risk</p>
                    <p className="text-3xl font-bold text-negative mb-4">{projectedRisk.toFixed(2)}</p>
                    <p className="text-sm text-text-secondary">Projected Return</p>
                    <p className="text-3xl font-bold text-positive">{projectedReturn.toFixed(2)}%</p>
                </div>
            </div>
        </Card>
    );
};

export default AllocationAdvisor;
