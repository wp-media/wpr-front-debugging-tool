import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/assets/tailwind.css';
import { onMessage } from 'webext-bridge/devtools';
import { Channels } from '@/Globals.ts';

onMessage(Channels.reloadDevTools, () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
