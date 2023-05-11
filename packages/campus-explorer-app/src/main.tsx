import * as React from 'react';
import App from './app/App';
import { createRoot } from 'react-dom/client';
import 'ol/ol.css';
// import './index.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
