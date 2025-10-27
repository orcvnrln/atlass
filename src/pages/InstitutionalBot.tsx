import React from 'react';

const JarvisAICopilot: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 border-2 border-blue-500">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full animate-pulse bg-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">
            Jarvis AI Copilot
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Your intelligent AI assistant is ready to help.
          </p>
          
          <div className="p-3 rounded-lg bg-blue-50">
            <p className="text-sm text-gray-800">
              💡 Ask me anything about your dashboard, analytics, or trading strategies.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2 px-4 rounded-lg font-medium transition-all hover:opacity-90 bg-blue-500 text-white">
              Start Chat
            </button>
            <button className="py-2 px-4 rounded-lg font-medium border-2 border-blue-500 text-blue-500 transition-all hover:bg-gray-50">
              Help
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JarvisAICopilot;
