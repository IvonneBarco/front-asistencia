import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const APP_VERSION = import.meta.env.VITE_APP_VERSION;

function forceUpdateIfNewVersion() {
  const storedVersion = localStorage.getItem('app_version');
  if (storedVersion !== APP_VERSION) {
    // Desregistrar Service Workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister());
      });
    }
    // Limpiar caches
    if (window.caches) {
      caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    }
    // Limpiar localStorage si es necesario (excepto datos críticos)
    Object.keys(localStorage).forEach(key => {
      if (key !== 'auth_token' && key !== 'user_data') {
        localStorage.removeItem(key);
      }
    });
    // Guardar nueva versión
    localStorage.setItem('app_version', APP_VERSION);
    // Forzar recarga completa
    window.location.reload();
  }
}

forceUpdateIfNewVersion();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
