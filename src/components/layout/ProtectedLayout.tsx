import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import RouteDebugger from '@/components/debug/RouteDebugger';
import AIAssistant from '@/components/ai/AIAssistant';
import VoiceAssistant from '@/components/ai/VoiceAssistant';
import { Toaster } from 'react-hot-toast';

const ProtectedLayout: React.FC = () => {
  const isDev = import.meta.env?.DEV ?? false;

  return (
    <>
      {isDev && <RouteDebugger />}
      <div className="flex h-screen bg-primary-bg">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
        <AIAssistant />
        <VoiceAssistant />
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
          },
        }}
        containerStyle={{
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      />
    </>
  );
};

export default ProtectedLayout;
