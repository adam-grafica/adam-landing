import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import gsap from 'gsap'

// GSAP Performance Optimization: Prevent forced reflows by disabling lazy property updates
gsap.config({ lazy: false });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
