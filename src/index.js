import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global resets
const style = document.createElement('style');
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060612; color: #fff; -webkit-font-smoothing: antialiased; }
  input, select, textarea, button { font-family: inherit; }
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(1) opacity(0.4);
    cursor: pointer;
  }
  select option { background: #0d1b3e; color: #fff; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0a0a1a; }
  ::-webkit-scrollbar-thumb { background: rgba(99,179,237,0.3); border-radius: 3px; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);