import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { PrivyProvider } from '@privy-io/react-auth';

ReactDOM.createRoot(document.getElementById('root')).render(
  <PrivyProvider appId="cmcn6y46j00mnl40m3u5bee9v">
    <App />
  </PrivyProvider>
);
