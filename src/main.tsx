import './utils/lazyThirdParty.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// ✅ React se monta PRIMERO, sin esperar a GSAP
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// ✅ GSAP se configura DESPUÉS del mount, de forma asíncrona
// Esto permite que React pinte el hero antes de que GSAP cargue
import('gsap').then(({ default: gsap }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (gsap as any).config({ lazy: false })
})
