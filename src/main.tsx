import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';
import { ThemeProvider } from '@/components/theme-provider';
import { AudioProvider } from '@/components/audio-provider';

import './index.css';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider storageKey="ui-theme">
      <AudioProvider>
        <App />
      </AudioProvider>
    </ThemeProvider>
  </React.StrictMode>
);
