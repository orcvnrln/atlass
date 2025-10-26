import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { JournalProvider } from '@/context/JournalContext';
import { UserProvider } from '@/context/UserContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <JournalProvider>
          <App />
        </JournalProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>
);
