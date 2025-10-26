import React from 'react';
import Card from '@/components/dashboard/Card';
import { AlertTriangle, BrainCircuit } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const StressTest = () => {
  const [scenario, setScenario] = React.useState('');

  const handleStressTest = () => {
    toast({
      title: "Stress Test Scenario",
      description: "FED raises rates by 0.5% -> Portfolio impact: -3.2% (-$4,078.41) 📉",
      variant: "destructive",
    });
  };

  const handleScenarioAnalysis = () => {
    if (!scenario) {
      toast({
        title: "Input Required",
        description: "Please enter a 'what-if' scenario.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "AI Scenario Analysis",
      description: `For the scenario "${scenario}", the AI predicts a potential portfolio impact of -5.7% (-$7,231.88) 📉 due to tech sector volatility.`,
    });
  };

  return (
    <Card title="Portfolio Resilience">
      <div className="flex flex-col h-full space-y-4">
        <div>
            <h3 className='text-base font-semibold text-text-on-card-primary mb-2'>Pre-defined Stress Test</h3>
            <p className="text-center text-sm text-text-secondary mb-4">
            Simulate a pre-defined market shock.
            </p>
            <button
            onClick={handleStressTest}
            className="w-full bg-accent-red text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
            <AlertTriangle className="w-5 h-5" />
            <span>Run FED Rate Hike Scenario</span>
            </button>
        </div>
        
        <div className="border-t border-border-on-card my-4"></div>

        <div>
            <h3 className='text-base font-semibold text-text-on-card-primary mb-2'>AI "What-If" Analysis</h3>
            <p className="text-center text-sm text-text-secondary mb-4">
                Ask the AI to simulate a custom scenario.
            </p>
            <div className="flex space-x-2">
                <input
                type="text"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="e.g., What if oil prices surge by 20%?"
                className="w-full bg-input-background text-text-on-card-primary border border-border-on-card rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                onClick={handleScenarioAnalysis}
                className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
                >
                <BrainCircuit className="w-5 h-5" />
                <span>Analyze</span>
                </button>
            </div>
        </div>
      </div>
    </Card>
  );
};

export default StressTest;
