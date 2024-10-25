import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';
import { sendMessage } from 'webext-bridge/popup';
import { Channels, ChannelTargets } from '@/Globals.ts';

sendMessage(Channels.processPageData, {}, ChannelTargets.contentScript);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
