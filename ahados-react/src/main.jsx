import React from 'react';
import { createRoot } from 'react-dom/client';
import { OSProvider } from './os/OSContext';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OSProvider>
      <App />
    </OSProvider>
  </React.StrictMode>
);
