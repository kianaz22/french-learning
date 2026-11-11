import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthProvider';
import './styles/global.css';

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    window.addEventListener('load', () => {
      const base = import.meta.env.BASE_URL;
      navigator.serviceWorker
        .register(`${base}sw.js?v=5`, { scope: base, updateViaCache: 'none' })
        .then((reg) => reg.update())
        .catch(() => {
          /* offline support optional */
        });
    });
  } else {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
