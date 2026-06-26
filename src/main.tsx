import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

window.addEventListener('error', (e) => {
  document.getElementById('root')!.innerHTML =
    `<pre style="color:red;padding:24px;font-size:13px;white-space:pre-wrap">JS ERROR:\n${e.message}\n\n${e.filename}:${e.lineno}:${e.colno}</pre>`
})

window.addEventListener('unhandledrejection', (e) => {
  document.getElementById('root')!.innerHTML =
    `<pre style="color:red;padding:24px;font-size:13px;white-space:pre-wrap">UNHANDLED PROMISE:\n${e.reason}</pre>`
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
