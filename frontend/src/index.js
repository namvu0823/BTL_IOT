import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';

// Tìm element với id 'root'
const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Sử dụng createRoot

// Render ứng dụng
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);