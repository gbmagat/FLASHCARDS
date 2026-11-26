import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Entry point: mounts the app into #root in index.html. StrictMode runs
// extra development-only checks for common React mistakes.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
