import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Router } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import '@/assets/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
