import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios';
import './index.css'
import App from './App.jsx'

// Dynamically rewrite hardcoded localhost API endpoints to follow Vercel routing rules
axios.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith('http://localhost:8000')) {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      config.url = config.url.replace('http://localhost:8000', apiUrl);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
