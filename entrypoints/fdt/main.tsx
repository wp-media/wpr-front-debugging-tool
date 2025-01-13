import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/assets/tailwind.css';
import { onMessage } from 'webext-bridge/devtools';
import { Channels } from '@/Globals.ts';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

onMessage(Channels.reloadDevTools, () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router hook={useHashLocation}>
      <App />
    </Router>
  </React.StrictMode>
);
