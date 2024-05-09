import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';
import { AudioContext as ReactAudioContext } from './audioContext'

import './index.css';

// add this to prompt for a refresh
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  }
});

const context = new AudioContext();
const stereoPanner = context.createStereoPanner();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactAudioContext.Provider value={{
      context,
      stereoPanner,
    }}>
      <App />
    </ReactAudioContext.Provider>
  </React.StrictMode>
);
